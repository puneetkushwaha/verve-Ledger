"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Eye,
  Calendar,
  User,
  CreditCard,
  Loader2,
  Filter,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchInvoices();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {
      console.error("Failed to load settings");
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (res.ok) {
        setInvoices(data);
      }
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (inv: any) => {
    const WinPrint = window.open('', '', 'width=800,height=900');
    const themeColor = settings?.themeColor || '#00CF64';
    
    WinPrint?.document.write(`
      <html>
        <head>
          <title>Invoice - ${inv.invoiceNumber}</title>
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
                <p>DATE: <span style="color: #000; margin-left: 10px;">${format(new Date(inv.createdAt), "dd/MM/yyyy")}</span></p>
              </div>
              <h1 class="title">INVOICE</h1>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 60px;">
              <div style="border-left: 4px solid #eee; padding-left: 20px;">
                <p style="font-size: 10px; font-weight: 900; color: #888; margin-bottom: 10px; letter-spacing: 2px;">INVOICE TO</p>
                <p style="font-size: 22px; font-weight: 900; margin-bottom: 5px;">${inv.customer?.name || 'Walk-in Customer'}</p>
                <p style="font-size: 12px; color: #666; font-weight: 500;">PH: ${inv.customer?.phone || 'N/A'}</p>
              </div>
              <div style="text-align: right; border-right: 4px solid #eee; padding-right: 20px;">
                <p style="font-size: 10px; font-weight: 900; color: #888; margin-bottom: 10px; letter-spacing: 2px;">FROM</p>
                <p style="font-size: 22px; font-weight: 900; margin-bottom: 5px;">${settings?.shopName || 'Our Shop'}</p>
                <p style="font-size: 12px; color: #666; font-weight: 500;">${settings?.address || 'Shop Address'}</p>
                ${settings?.gstin ? `<p style="font-size: 10px; font-weight: 900; margin-top: 5px;">GSTIN: ${settings.gstin}</p>` : ''}
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
                ${inv.items?.map((item: any) => `
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
                  <p style="font-size: 10px; color: #888; margin-top: 5px;">${settings?.shopName || 'Verified'}</p>
               </div>
               <div style="text-align: right; font-size: 10px; color: #888;">
                  <p>Computer generated invoice.</p>
                  <p>Verified on neural link ${new Date().toLocaleTimeString()}</p>
               </div>
            </div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    WinPrint?.document.close();
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse px-4">
        <div className="flex justify-between items-center">
           <Skeleton className="h-16 w-80 rounded-3xl" />
           <Skeleton className="h-16 w-64 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20 shadow-xl">
                <FileText className="w-5 h-5 text-[#00CF64]" />
            </div>
            <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Bill Archive</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.4em] ml-14">Historical Ledger</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-all" />
            <Input 
              placeholder="Search Bills..." 
              className="pl-14 h-12 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-slate-700 font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 bg-white/5 border-white/5 text-white rounded-2xl">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="space-y-4">
        {filteredInvoices.map((inv) => (
          <div key={inv.id} className="premium-card group relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00CF64] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8 w-full lg:w-auto">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Bill No</span>
                        <span className="text-lg font-black text-white font-outfit tracking-tighter">{inv.invoiceNumber}</span>
                    </div>

                    <div className="w-px h-10 bg-white/5 hidden md:block" />

                    <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00CF64] font-black text-lg shadow-xl">
                            {inv.customer?.name?.charAt(0) || "C"}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tight">{inv.customer?.name || "Walk-in Customer"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3.5 h-3.5 text-slate-700" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{format(new Date(inv.createdAt), "dd MMM, yyyy")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-right">
                        <p className="text-xl font-black text-white font-outfit tracking-tighter">₹{inv.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    </div>

                    <div className={cn(
                        "px-6 py-3 rounded-2xl border flex items-center gap-3 transition-all duration-500 group-hover:scale-105",
                        inv.paymentStatus === "PAID" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-[#00CF64]" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    )}>
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            inv.paymentStatus === "PAID" ? "bg-[#00CF64] shadow-[0_0_10px_rgba(0,207,100,0.8)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                        )} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{inv.paymentStatus}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Button 
                          onClick={() => window.open(`/view-invoice/${inv.id}`, '_blank')}
                          className="h-14 w-14 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                          <Eye className="w-6 h-6" />
                        </Button>
                        <Button 
                          onClick={() => handlePrint(inv)}
                          className="h-14 w-14 bg-white/5 text-slate-500 hover:text-[#00CF64] hover:bg-[#00CF64]/10 rounded-2xl transition-all border border-white/5">
                          <Printer className="w-6 h-6" />
                        </Button>
                        <Button 
                          onClick={() => handlePrint(inv)}
                          className="h-14 w-14 bg-rose-500/5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl transition-all border border-rose-500/10">
                          <Download className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {filteredInvoices.length === 0 && (
          <div className="py-48 flex flex-col items-center justify-center text-slate-800 bg-[#050505] rounded-[4rem] border border-white/5 shadow-3xl group">
            <FileText className="w-24 h-24 mb-8 opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12" />
            <p className="font-black uppercase tracking-[0.6em] text-[12px]">Neural Archive Empty</p>
            <p className="text-[9px] font-bold text-slate-600 uppercase mt-4 tracking-widest opacity-50">No verified transactions were found in the current sector</p>
          </div>
        )}
      </div>

      {/* Quick Summary Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
          <div className="glass-dark rounded-[3rem] p-6 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between px-10">
              <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center text-[#00CF64]"><TrendingUp className="w-5 h-5" /></div>
                  <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Ledger Value</p>
                      <p className="text-xl font-black text-white font-outfit tracking-tighter">₹{filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                  <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Records</p>
                      <p className="text-xl font-black text-white font-outfit tracking-tighter">{filteredInvoices.length}</p>
                  </div>
                  <Button className="h-12 px-6 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-[9px]">Export Archive</Button>
              </div>
          </div>
      </div>
    </div>
  );
}
