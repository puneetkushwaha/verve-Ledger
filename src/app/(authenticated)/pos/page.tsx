"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  QrCode,
  Save,
  Printer,
  X,
  Loader2,
  Package,
  MessageSquare,
  CheckCircle2,
  Maximize,
  ShoppingCart,
  Zap,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  ShieldCheck,
  User,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Skeleton } from "@/components/ui/skeleton";

export default function POSPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categories, setCategories] = useState<string[]>([]);
  const [receivedAmount, setReceivedAmount] = useState<number | "">("");
  const [upiId, setUpiId] = useState("");
  const [defaultGstRate, setDefaultGstRate] = useState(18);
  const [shopDetails, setShopDetails] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok) {
        setUpiId(data.upiId || "");
        setDefaultGstRate(data.defaultGstRate || 18);
        setShopDetails(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    let scanner: any = null;
    if (showScanner) {
      setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(onScanSuccess, onScanFailure);
      }, 500);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((error: any) => console.error("Failed to clear scanner", error));
      }
    };
  }, [showScanner]);

  function onScanSuccess(decodedText: string) {
    const product = products.find(p => p.barcode === decodedText || p.sku === decodedText);
    if (product) {
      addToCart(product);
      toast.success(`Node linked: ${product.name}`, {
          className: "bg-[#050505] border-[#00CF64]/20 text-white rounded-2xl"
      });
      setShowScanner(false);
    } else {
      toast.error("Node identity not found in matrix");
    }
  }

  function onScanFailure(error: any) {}

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
        const cats: string[] = Array.from(new Set(data.map((p: any) => p.category || "General")));
        setCategories(["ALL", ...cats]);
      } else {
        toast.error(data.error || "Failed to load matrix nodes");
      }
    } catch (error) {
      toast.error("Matrix connection error");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = cart.reduce((acc, item) => acc + (item.price * item.quantity * (item.gstRate || defaultGstRate) / 100), 0);
  const total = subtotal + gst - discount;

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Node depletion detected: Out of stock");
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Insufficient resource threshold");
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > (product?.stock || 0)) {
          toast.error("Insufficient resource threshold");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Matrix buffer is empty");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          taxAmount: gst,
          discount,
          paymentMode,
          shopId: (session?.user as any)?.shopId
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setLastInvoice(data);
        setShowSuccess(true);
        setCart([]);
        setDiscount(0);
        setReceivedAmount("");
        fetchProducts(); 
        toast.success("Transaction synchronized successfully");
      } else {
        toast.error(data.error || "Failed to sync transaction");
      }
    } catch (error) {
      toast.error("Neural link error during checkout");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = (invoiceData?: any) => {
    const inv = invoiceData || lastInvoice;
    if (!inv) return;

    const WinPrint = window.open('', '', 'width=800,height=900');
    const themeColor = shopDetails?.themeColor || '#00CF64';

    WinPrint?.document.write(`
      <html>
        <head>
          <title>Institutional Bill - ${inv?.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .invoice-page { border: 12px solid ${themeColor}; padding: 60px; min-height: 800px; border-radius: 4px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 60px; }
            .title { font-size: 60px; font-weight: 900; color: ${themeColor}; letter-spacing: -3px; line-height: 1; }
            table { width: 100%; border-collapse: collapse; margin: 40px 0; }
            th { background: ${themeColor}; color: white; padding: 20px; text-align: left; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
            td { padding: 20px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 700; }
            .totals { width: 300px; margin-left: auto; background: #000; color: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
            .total-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; font-weight: 700; opacity: 0.8; }
            .final { font-size: 24px; font-weight: 900; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 20px; opacity: 1; }
          </style>
        </head>
        <body>
          <div class="invoice-page">
            <div class="header">
              <div style="font-size: 12px; font-weight: 900; color: #888;">
                <p style="margin-bottom: 5px;">BILL NO: <span style="color: #000; margin-left: 10px;">${inv.invoiceNumber}</span></p>
                <p>DATE: <span style="color: #000; margin-left: 10px;">${new Date().toLocaleDateString()}</span></p>
              </div>
              <h1 class="title">INVOICE</h1>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 60px;">
              <div style="border-left: 4px solid #eee; padding-left: 20px;">
                <p style="font-size: 10px; font-weight: 900; color: #888; margin-bottom: 10px; letter-spacing: 2px;">INVOICE TO</p>
                <p style="font-size: 22px; font-weight: 900; margin-bottom: 5px;">${customerPhone || 'Walk-in Customer'}</p>
                <p style="font-size: 12px; color: #666; font-weight: 500;">PH: ${customerPhone || 'N/A'}</p>
              </div>
              <div style="text-align: right; border-right: 4px solid #eee; padding-right: 20px;">
                <p style="font-size: 10px; font-weight: 900; color: #888; margin-bottom: 10px; letter-spacing: 2px;">FROM</p>
                <p style="font-size: 22px; font-weight: 900; margin-bottom: 5px;">${shopDetails?.shopName || 'Our Shop'}</p>
                <p style="font-size: 12px; color: #666; font-weight: 500;">${shopDetails?.address || 'Shop Address'}</p>
                ${shopDetails?.gstin ? `<p style="font-size: 10px; font-weight: 900; margin-top: 5px;">GSTIN: ${shopDetails.gstin}</p>` : ''}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center;">Price</th>
                  <th style="text-align: center;">QTY</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(cart.length > 0 ? cart : (inv?.items as any[]) || []).map((item: any) => `
                  <tr>
                    <td style="color: #000;">${item.product?.name || item.name}</td>
                    <td style="text-align: center;">₹${item.price.toLocaleString()}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right; font-weight: 900;">₹${(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="totals" style="background-color: ${themeColor}">
              <div class="total-row"><span>Subtotal</span> <span>₹${(inv.totalAmount + inv.discount - inv.taxAmount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
              <div class="total-row"><span>Tax Charge</span> <span>₹${inv.taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
              ${inv.discount > 0 ? `<div class="total-row"><span>Rebate</span> <span>-₹${inv.discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>` : ''}
              <div class="total-final total-row final"><span>TOTAL DUE</span> <span>₹${inv.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
            </div>
            <div style="margin-top: 60px; display: flex; justify-content: space-between; padding-top: 40px; border-top: 2px solid #000;">
               <div style="text-align: center; width: 200px;">
                  <p style="font-size: 12px; font-weight: 900;">AUTHORIZED SIGNATORY</p>
                  <p style="font-size: 10px; color: #888; margin-top: 5px;">${shopDetails?.shopName || 'Verified'}</p>
               </div>
               <div style="text-align: right; font-size: 10px; color: #888;">
                  <p>Computer generated invoice.</p>
                  <p>Verified on neural link ${new Date().toLocaleTimeString()}</p>
               </div>
            </div>
          </div>
          <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
        </body>
      </html>
    `);
    WinPrint?.document.close();
  };

  const quickCash = [100, 500, 2000];

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-10 min-h-[calc(100vh-120px)] animate-pulse max-w-7xl mx-auto px-4">
        <div className="flex-1 flex flex-col gap-8">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-32 rounded-2xl flex-shrink-0" />)}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-72 w-full rounded-[3rem]" />)}
          </div>
        </div>
        <div className="w-full lg:w-[450px] h-full">
          <Skeleton className="h-screen w-full rounded-[4rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 min-h-[calc(100vh-120px)] max-w-7xl mx-auto px-4 pb-20">
      {/* Main Selection Area */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Search & Scanner */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00CF64]/20 to-transparent blur opacity-25 group-hover:opacity-40 transition duration-1000" />
            <Card className="bg-[#050505] border-white/5 shadow-3xl rounded-[2.5rem] overflow-hidden relative">
              <CardContent className="p-4 flex gap-4">
                <div className="relative group flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600 group-focus-within:text-[#00CF64] transition-all" />
                  <Input 
                    placeholder="Search Matrix Nodes..." 
                    className="pl-16 h-16 bg-white/5 border-none text-2xl font-black font-outfit text-white placeholder:text-slate-800 focus:ring-0 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setShowScanner(true)}
                  className="h-16 w-16 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
                >
                  <QrCode className="w-6 h-6" />
                </Button>
              </CardContent>
            </Card>
        </div>
        
        {/* Category Matrix */}
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap border relative overflow-hidden group",
                selectedCategory === cat 
                  ? "bg-white border-white text-black shadow-lg scale-105 z-10" 
                  : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-1.5 relative z-10">
                <Tag className={cn("w-3.5 h-3.5", selectedCategory === cat ? "text-black" : "text-slate-700")} />
                {cat}
              </div>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 overflow-y-auto pr-4 custom-scrollbar pb-10">
          {products
            .filter(p => (selectedCategory === "ALL" || p.category === selectedCategory))
            .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search))
            .map(product => (
                  <Card 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="premium-card group cursor-pointer hover:border-[#00CF64]/30 transition-all duration-300 relative overflow-hidden bg-[#050505] border-white/5 rounded-2xl"
                  >
                    <CardContent className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-[#00CF64] group-hover:bg-[#00CF64]/10 transition-all border border-white/5">
                          <Package className="w-5 h-5" />
                        </div>
                        <p className={cn(
                            "px-1.5 py-0.5 rounded-md font-black text-[8px] uppercase tracking-widest border",
                            product.stock < 10 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-[#00CF64]/5 text-[#00CF64] border-[#00CF64]/10'
                        )}>{product.stock} In Stock</p>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-[#00CF64] transition-colors line-clamp-1">{product.name}</h3>
                        <p className="text-lg font-black text-[#00CF64] font-outfit mt-1 tracking-tighter">₹{product.price.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
          ))}
          {products.length === 0 && !loading && (
            <div className="col-span-full py-48 flex flex-col items-center justify-center text-slate-800 bg-[#050505] rounded-[4rem] border border-white/5 shadow-3xl opacity-50">
                <LayoutGrid className="w-20 h-20 mb-6 opacity-10" />
                <p className="font-black uppercase tracking-[0.6em] text-[12px]">Matrix Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Sidebar */}
      <Card className={cn(
        "flex flex-col bg-[#050505] border-white/5 shadow-2xl rounded-[2rem] overflow-hidden sticky top-8 transition-all duration-700 h-[calc(100vh-120px)]",
        cart.length === 0 ? "w-full lg:w-[100px] opacity-40" : "w-full lg:w-[400px]"
      )}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CF64]/10 blur-[100px] pointer-events-none" />
        
        <CardHeader className={cn("p-6 border-b border-white/5 relative z-10", cart.length === 0 && "border-none items-center justify-center h-full")}>
          <CardTitle className="text-xl font-black font-outfit uppercase tracking-tighter text-white flex justify-between items-center w-full">
            {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-4 group">
                    <div className="w-14 h-14 bg-[#00CF64]/10 rounded-2xl flex items-center justify-center border border-[#00CF64]/20 group-hover:scale-110 transition-transform">
                        <ShoppingCart className="w-7 h-7 text-[#00CF64]" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700 group-hover:text-white transition-colors">Empty Cart</span>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20">
                        <ShoppingCart className="w-5 h-5 text-[#00CF64]" />
                    </div>
                    <span>Billing</span>
                </div>
            )}
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCart([])} className="h-10 px-4 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all">
                Reset
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        {cart.length > 0 && (
          <div className="flex-1 px-6 relative z-10 overflow-y-auto custom-scrollbar">
            <div className="space-y-6 p-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/[0.03] p-3 rounded-xl border border-white/5 group hover:bg-white/[0.06] transition-all hover:translate-x-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white uppercase tracking-tight truncate group-hover:text-[#00CF64] transition-colors">{item.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white hover:bg-[#00CF64] transition-all"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center font-black text-white font-outfit text-[11px]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-white hover:bg-[#00CF64] transition-all"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><X className="w-3 h-3" /></button>
                    <div className="mt-2">
                        <p className="text-[10px] font-black text-[#00CF64] font-outfit tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-3xl space-y-2 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex-shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                <span>GST (18%)</span>
                <span className="text-white">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Discount</div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-black text-[9px]">₹</span>
                    <input 
                    type="number" 
                    value={discount} 
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-right text-white font-black font-outfit text-sm focus:border-[#00CF64]/50 outline-none"
                    />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-3 border-t-2 border-white/10">
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00CF64] mb-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00CF64] animate-pulse" />
                  Total Bill
              </div>
              <div className="text-2xl font-black text-white font-outfit tracking-tighter text-glow">₹{total.toFixed(2)}</div>
            </div>

            {/* Payment Method Matrix */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CASH', icon: Banknote, label: 'Cash' },
                { id: 'UPI', icon: QrCode, label: 'UPI' },
                { id: 'CARD', icon: CreditCard, label: 'Card' }
              ].map((mode) => (
                <button 
                  key={mode.id} 
                  onClick={() => setPaymentMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all border group relative overflow-hidden",
                    paymentMode === mode.id 
                      ? "bg-white border-white text-black shadow-md scale-105" 
                      : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                  )}
                >
                  <mode.icon className={cn("w-3.5 h-3.5", paymentMode === mode.id ? "text-black" : "text-slate-600 group-hover:text-white")} />
                  <span className="text-[7px] font-black uppercase tracking-widest">{mode.label}</span>
                </button>
              ))}
            </div>

            {/* UPI QR Display if selected */}
            {paymentMode === "UPI" && upiId && (
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 animate-in zoom-in duration-500 shadow-xl">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${shopDetails?.shopName || 'Node'}&am=${total.toFixed(2)}&cu=INR`)}`}
                    alt="UPI QR"
                    className="w-24 h-24"
                 />
                 <p className="text-[8px] font-black text-black uppercase tracking-widest">{upiId}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Received</label>
                <input 
                  type="number"
                  placeholder="0" 
                  className="premium-input w-full h-10 text-center text-sm"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || "")}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Change</label>
                <div className={cn(
                  "h-10 border rounded-xl flex items-center justify-center font-black font-outfit text-sm transition-all",
                  receivedAmount !== "" 
                    ? (receivedAmount - total >= 0 
                        ? "bg-emerald-500 text-black border-white shadow-md" 
                        : "bg-rose-500/20 border-rose-500/40 text-rose-500")
                    : "bg-white/5 border-white/5 text-slate-700"
                )}>
                  ₹{receivedAmount !== "" ? (receivedAmount - total).toFixed(2) : "0.00"}
                </div>
              </div>
            </div>

            <div className="space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-slate-600 ml-2">Phone</label>
                <input 
                placeholder="+91..." 
                className="premium-input w-full h-8 text-center text-[11px] tracking-widest"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                />
            </div>

            <Button 
              className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 mt-4"
              onClick={handleCheckout}
              disabled={submitting || cart.length === 0}
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete Billing <Save className="w-4 h-4" /></>}
            </Button>
          </div>
        )}
      </Card>

      {/* Modern Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[4rem] max-w-2xl p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          <div className="bg-gradient-to-br from-[#00CF64]/20 to-transparent p-12 text-center relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00CF64]/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="w-24 h-24 bg-white text-[#00CF64] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl mb-8 group">
              <CheckCircle2 className="w-14 h-14 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-4xl font-black font-outfit uppercase tracking-tighter text-white">Synchronization Complete</h3>
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] mt-3">Transaction successfully committed to ledger</p>
          </div>
          
          <div className="p-12 space-y-8">
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 text-center flex flex-col items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Settlement Amount</span>
              <p className="text-6xl font-black text-[#00CF64] font-outfit tracking-tighter">₹{lastInvoice?.totalAmount}</p>
              <div className="mt-6 flex items-center gap-3 bg-white/5 px-6 py-2 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#00CF64] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{lastInvoice?.invoiceNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Button onClick={() => {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
                const invoiceUrl = `${baseUrl}/view-invoice/${lastInvoice?.id}`;
                const text = `*Invoice from ${shopDetails?.shopName || 'Verve Nova'}*%0A%0A` +
                  `*Bill No:* ${lastInvoice?.invoiceNumber}%0A` +
                  `*Settlement:* ₹${lastInvoice?.totalAmount}%0A%0A` +
                  `*Digital Ledger Entry:* ${invoiceUrl}%0A%0A` +
                  `Thank you for authorized trade!`;
                
                const phone = customerPhone.replace(/\D/g, '');
                const finalPhone = phone.length === 10 ? `91${phone}` : phone;
                window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
              }} className="h-20 bg-[#25D366] text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] flex flex-col gap-1 items-center justify-center shadow-xl hover:scale-105 transition-all">
                <MessageSquare className="w-6 h-6" /> WhatsApp
              </Button>
              <Button onClick={() => handlePrint()} className="h-20 bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] rounded-[2rem] flex flex-col gap-1 items-center justify-center shadow-xl hover:scale-105 transition-all">
                <Printer className="w-6 h-6" /> Print Hub
              </Button>
            </div>
            
            <Button variant="ghost" onClick={() => setShowSuccess(false)} className="w-full h-16 text-slate-700 uppercase font-black tracking-widest text-[10px] hover:text-[#00CF64] hover:bg-[#00CF64]/5 rounded-[2rem] transition-all">
                Close Data Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Optical Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[4rem] max-w-lg p-10 overflow-hidden">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">Optical Matrix Link</DialogTitle>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Point sensor at product identity tag</p>
          </DialogHeader>
          <div id="reader" className="rounded-[2.5rem] overflow-hidden border-2 border-[#00CF64]/30 bg-black/60 shadow-2xl"></div>
          <Button variant="ghost" onClick={() => setShowScanner(false)} className="w-full mt-8 text-rose-500 font-black uppercase tracking-widest text-[10px]">Deactivate Scanner</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Box({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
    )
}
