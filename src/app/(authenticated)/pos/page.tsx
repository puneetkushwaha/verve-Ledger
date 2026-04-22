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
  Maximize
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let scanner: any = null;
    if (showScanner) {
      setTimeout(() => {
        scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
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
      toast.success(`Added: ${product.name}`);
      setShowScanner(false);
    } else {
      toast.error("Product not found in matrix");
    }
  }

  function onScanFailure(error: any) {}

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        toast.error(data.error || "Failed to load products");
      }
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18; // Default 18% GST for simplicity
  const total = subtotal + gst - discount;

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Product out of stock!");
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.error("Not enough stock!");
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
          toast.error("Not enough stock!");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
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
        toast.success("Invoice generated successfully!");
        setLastInvoice(data);
        setShowSuccess(true);
        setCart([]);
        setDiscount(0);
        fetchProducts(); // Refresh stock
      } else {
        toast.error(data.error || "Failed to save invoice");
      }
    } catch (error) {
      toast.error("Error saving invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const sendWhatsApp = () => {
    if (!customerPhone) {
      toast.error("Please enter customer phone number");
      return;
    }
    const phone = customerPhone.startsWith("91") ? customerPhone : `91${customerPhone}`;
    const message = `*INVOICE: ${lastInvoice?.invoiceNumber}*\n\nHello! Here is your invoice from *${session?.user?.name}*.\n\n*Total Amount:* ₹${lastInvoice?.totalAmount}\n*Payment Mode:* ${lastInvoice?.paymentMode}\n\nThank you for shopping with us! 🙏`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00CF64]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 h-full overflow-hidden">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-8 h-full overflow-hidden">
        <Card className="bg-[#050505] border-white/5 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-4 flex gap-4">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-[#00CF64] transition-colors" />
              <Input 
                placeholder="Search Matrix..." 
                className="pl-14 h-16 bg-white/5 border-none text-xl font-black font-outfit text-white placeholder:text-slate-600 focus:ring-0 transition-all outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setShowScanner(true)}
              className="h-16 w-16 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-2xl shadow-[0_0_20px_rgba(0,207,100,0.2)]"
            >
              <QrCode className="w-8 h-8" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode?.includes(search)).map(product => (
            <Card 
              key={product.id} 
              className={cn(
                "cursor-pointer group relative overflow-hidden transition-all duration-500 rounded-3xl border-white/5 bg-white/5 hover:border-[#00CF64]/50 hover:bg-white/10 shadow-xl h-fit",
                product.stock <= 0 ? 'opacity-30 grayscale pointer-events-none' : ''
              )}
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-6">
                <div className="w-full aspect-square bg-black/20 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 border border-white/5">
                  <Package className="w-10 h-10 text-slate-700 group-hover:text-[#00CF64] transition-colors" />
                </div>
                <h3 className="font-black font-outfit text-white uppercase tracking-tighter truncate text-lg">{product.name}</h3>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Unit Price</p>
                    <p className="text-xl font-black text-[#00CF64] font-outfit tracking-tighter">₹{product.price}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest",
                    product.stock < 10 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  )}>
                    Stock: {product.stock}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <Card className="w-full lg:w-[450px] flex flex-col bg-[#050505] border-white/5 shadow-3xl rounded-[3rem] overflow-hidden relative h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[100px] pointer-events-none" />
        <CardHeader className="p-8 border-b border-white/5 relative z-10">
          <CardTitle className="text-2xl font-black font-outfit uppercase tracking-tighter text-white flex justify-between items-center">
            Ledger
            <Button variant="ghost" size="sm" onClick={() => setCart([])} className="h-10 px-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-black uppercase tracking-widest text-[10px]">
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        
        <div className="flex-1 px-4 relative z-10 overflow-y-auto custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 py-40">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-black uppercase tracking-[0.3em] text-[10px]">Cart Empty</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 group">
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tighter truncate">{item.name}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">-</button>
                      <span className="text-sm font-black text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-500"><X className="w-4 h-4" /></button>
                    <p className="text-lg font-black text-white font-outfit tracking-tighter">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl space-y-4 relative z-10">
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
              <span>Gross Total</span>
              <span className="text-white">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
              <span>GST (18%)</span>
              <span className="text-white">₹{gst.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-2 border-t border-white/5">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00CF64]">Total</div>
            <div className="text-4xl font-black text-white font-outfit tracking-tighter">₹{total.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['CASH', 'UPI', 'CARD'].map((mode) => (
              <Button 
                key={mode} 
                onClick={() => setPaymentMode(mode)}
                className={cn(
                  "h-12 rounded-xl font-black text-[10px] uppercase tracking-widest",
                  paymentMode === mode ? "bg-[#00CF64] text-white" : "bg-white/5 text-slate-500"
                )}
              >
                {mode}
              </Button>
            ))}
          </div>

          <Input 
            placeholder="Customer Phone Matrix..." 
            className="h-14 bg-white/5 border-white/10 rounded-2xl text-white text-center"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <Button 
            className="w-full h-16 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(0,207,100,0.2)] transition-all flex items-center justify-center gap-3"
            onClick={handleCheckout}
            disabled={submitting || cart.length === 0}
          >
            {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finalize Transaction <Save className="w-5 h-5" /></>}
          </Button>
        </div>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[40px] max-w-md p-10">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-[#00CF64]/10 rounded-3xl flex items-center justify-center mx-auto text-[#00CF64]">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter text-white">Success</h3>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
              <p className="text-[#00CF64] text-2xl font-black">₹{lastInvoice?.totalAmount}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase mt-1">Invoice: {lastInvoice?.invoiceNumber}</p>
            </div>
            <div className="grid gap-4">
              <Button onClick={sendWhatsApp} className="h-16 bg-[#00CF64] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl flex gap-3">
                <MessageSquare className="w-5 h-5" /> Send on WhatsApp
              </Button>
              <Button variant="ghost" onClick={() => setShowSuccess(false)} className="text-slate-500 uppercase font-black tracking-widest text-[10px]">Close Matrix</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[40px] max-w-lg p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter">Optical Scanner</DialogTitle>
          </DialogHeader>
          <div id="reader" className="mt-6 rounded-3xl overflow-hidden border border-white/10 bg-black/40"></div>
          <Button onClick={() => setShowScanner(false)} className="mt-8 h-14 bg-white/5 text-slate-500 font-black uppercase tracking-widest text-[10px]">Abort</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShoppingCart(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
