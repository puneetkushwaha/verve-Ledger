"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Store,
  Palette,
  Loader2,
  Settings2,
  FileText,
  CreditCard,
  Building2,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MapPin,
  Hash,
  Save,
  CheckCircle2,
  Sparkles,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("shop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shopName: "",
    email: "",
    phone: "",
    address: "",
    invoicePrefix: "INV",
    themeColor: "#00CF64",
    fontFamily: "Inter",
    upiId: "",
    gstin: "",
    defaultGstRate: 18,
    terms: ""
  });

  useEffect(() => {
    if (tabParam && (tabParam === "shop" || tabParam === "invoice")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("All protocols updated successfully", {
          icon: <CheckCircle2 className="w-5 h-5 text-[#00CF64]" />,
          className: "bg-[#050505] border-white/10 text-white rounded-2xl"
        });
      } else {
        toast.error("Protocol update failed");
      }
    } catch (error) {
      toast.error("Neural link error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-4 w-96 opacity-20" />
          </div>
          <Skeleton className="h-12 w-40 rounded-2xl hidden lg:block" />
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-80 space-y-3">
            <Skeleton className="h-24 w-full rounded-[2rem]" />
            <Skeleton className="h-24 w-full rounded-[2rem]" />
          </div>
          <div className="flex-1 space-y-8">
            <Skeleton className="h-[600px] w-full rounded-[3rem]" />
          </div>
        </div>
      </div>
    );
  }

  const themeColor = settings.themeColor || '#00CF64';

  const sections = [
    { id: "shop", label: "Store Profile", icon: Building2 },
    { id: "invoice", label: "Branding", icon: Palette },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-40">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20 shadow-xl">
              <Settings2 className="w-5 h-5 text-[#00CF64]" />
            </div>
            <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">System Configuration</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.4em] ml-14">Matrix Preferences & Sync</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="hidden lg:flex h-11 px-8 bg-[#00CF64] text-white hover:bg-[#10B981] rounded-xl font-black uppercase tracking-widest text-[11px] gap-2 shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 px-4">
        {/* Sidebar */}
        <div className="lg:w-72 space-y-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-6 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border group",
                activeTab === section.id
                  ? "bg-white border-white text-black shadow-2xl scale-[1.02]"
                  : "bg-white/5 border-white/5 text-slate-500 hover:text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-4">
                <section.icon className="w-5 h-5" />
                <span>{section.label}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === section.id ? "rotate-90" : "opacity-20 group-hover:opacity-100")} />
            </button>
          ))}

          <div className="mt-10 p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#00CF64]/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00CF64]/10 blur-3xl rounded-full" />
            <Sparkles className="w-8 h-8 text-[#00CF64] mb-4 opacity-50 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">Your business identity is encrypted and stored in the core matrix.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "shop" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
              <Card className="premium-card relative">
                <CardHeader className="p-5 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black text-white uppercase tracking-tight font-outfit">Identity Protocol</CardTitle>
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">Configure your shop settings</p>
                  </div>
                  <Building2 className="w-6 h-6 text-[#00CF64] opacity-20" />
                </CardHeader>
                <CardContent className="p-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 group">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 ml-2">Business Name</label>
                      <input
                        value={settings.shopName}
                        onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                        className="premium-input w-full h-10"
                        placeholder="Shop Name"
                      />
                    </div>
                    <div className="space-y-1.5 group">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 ml-2">Phone</label>
                      <input
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="premium-input w-full"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                    <div className="col-span-full space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Physical Coordinates (Address)</label>
                      <input
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="premium-input w-full"
                        placeholder="Complete business address..."
                      />
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Tax Identity (GSTIN)</label>
                      <input
                        value={settings.gstin}
                        onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                        className="premium-input w-full uppercase"
                        placeholder="27XXXXX..."
                      />
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Default Tax Load (%)</label>
                      <input
                        type="number"
                        value={settings.defaultGstRate}
                        onChange={(e) => setSettings({ ...settings, defaultGstRate: parseFloat(e.target.value) || 0 })}
                        className="premium-input w-full"
                      />
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Payment Portal (UPI ID)</label>
                      <input
                        value={settings.upiId}
                        onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                        className="premium-input w-full"
                        placeholder="name@okaxis"
                      />
                    </div>
                    <div className="space-y-3 group">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Bill Prefix Key</label>
                      <input
                        value={settings.invoicePrefix}
                        onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                        className="premium-input w-full uppercase font-black"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4 group-focus-within:text-[#00CF64] transition-colors">Protocol Terms & Disclaimer</label>
                    <textarea
                      value={settings.terms}
                      onChange={(e) => setSettings({ ...settings, terms: e.target.value })}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white text-sm outline-none font-medium focus:border-[#00CF64]/50 transition-all"
                      placeholder="Add terms and conditions..."
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.01]"
                  >
                    {saving ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Save className="w-6 h-6" /> Sync Data Matrix</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "invoice" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="premium-card">
                <CardHeader className="p-12 border-b border-white/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-white uppercase tracking-tight font-outfit">Aesthetic Core</CardTitle>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Manage your brand's visual identity</p>
                  </div>
                  <Palette className="w-10 h-10 text-[#00CF64] opacity-20" />
                </CardHeader>
                <CardContent className="p-12 space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 ml-4">
                      <Layers className="w-4 h-4 text-[#00CF64]" />
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Theme Color</label>
                    </div>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
                      {[
                        "#00CF64", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#D946EF",
                        "#F43F5E", "#F97316", "#F59E0B", "#EAB308", "#2DD4BF", "#06B6D4"
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => setSettings({ ...settings, themeColor: color })}
                          className={cn(
                            "aspect-square rounded-2xl border-4 transition-all duration-500 relative group",
                            themeColor === color ? "border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.3)] z-10" : "border-transparent opacity-30 hover:opacity-100 hover:scale-110"
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {themeColor === color && (
                            <CheckCircle2 className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full h-20 bg-white text-black hover:bg-slate-100 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.01]"
                  >
                    {saving ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Save className="w-6 h-6" /> Commit Visual Core</>}
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Live Preview */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20">
                      <Eye className="w-5 h-5 text-[#00CF64]" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white font-outfit">Protocol Preview</h3>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Live Synchronization Active</span>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00CF64]/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative bg-white border-[12px] p-16 text-black shadow-3xl min-h-[900px] flex flex-col font-inter transition-all duration-700 rounded-sm" style={{ borderColor: themeColor }}>
                    <div className="flex justify-between items-start mb-16">
                      <div className="text-[11px] font-black text-slate-400 space-y-2 uppercase tracking-widest">
                        <p className="flex justify-between w-40"><span>NO.</span> <span className="text-black">{settings.invoicePrefix}-1001</span></p>
                        <p className="flex justify-between w-40"><span>DATE</span> <span className="text-black">{new Date().toLocaleDateString()}</span></p>
                      </div>
                      <div className="text-right">
                        <h2 className="text-7xl font-black tracking-[-0.05em] leading-none mb-2" style={{ color: themeColor }}>INVOICE</h2>
                        <div className="h-1.5 w-32 bg-black ml-auto" style={{ backgroundColor: themeColor }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-16 mb-20">
                      <div className="border-l-4 border-slate-100 pl-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">RECEIVER PROTOCOL</div>
                        <div className="text-2xl font-black uppercase mb-2 tracking-tight">VIP CLIENT CORE</div>
                        <div className="text-xs text-slate-600 font-medium leading-relaxed">
                          Neural Link 001<br />
                          Satellite Sector 7G<br />
                          Global Port: +91 98765 43210
                        </div>
                      </div>
                      <div className="text-right border-r-4 border-slate-100 pr-8">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">SENDER IDENTITY</div>
                        <div className="text-2xl font-black uppercase mb-2 tracking-tight">{settings.shopName || "SYSTEM NODE"}</div>
                        <div className="text-xs text-slate-600 font-medium leading-relaxed">
                          {settings.address || "Main Distribution Hub"}<br />
                          PORT: {settings.phone || "0000000000"}<br />
                          {settings.gstin && <span className="font-black text-black mt-3 block bg-slate-100 inline-block px-3 py-1 rounded-md tracking-widest">GSTIN: {settings.gstin}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="text-white grid grid-cols-12 px-8 py-5 font-black text-[12px] uppercase tracking-widest rounded-lg mb-4" style={{ backgroundColor: themeColor }}>
                        <div className="col-span-6">Resource Description</div>
                        <div className="col-span-2 text-center">Unit Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Net Assets</div>
                      </div>
                      <div className="grid grid-cols-12 px-8 py-8 text-[13px] font-black border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                          Neural Processor Type-X
                        </div>
                        <div className="col-span-2 text-center">₹45,000</div>
                        <div className="col-span-2 text-center">01</div>
                        <div className="col-span-2 text-right">₹45,000.00</div>
                      </div>
                      <div className="grid grid-cols-12 px-8 py-8 text-[13px] font-black border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
                          Quantum Cooling Hub
                        </div>
                        <div className="col-span-2 text-center">₹12,500</div>
                        <div className="col-span-2 text-center">02</div>
                        <div className="col-span-2 text-right">₹25,000.00</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-20 gap-16">
                      <div className="flex-1 border-2 border-slate-100 p-8 rounded-[2rem] bg-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-3xl -mr-16 -mt-16" />
                        <div className="font-black uppercase border-b border-slate-200 pb-4 mb-4 text-[10px] tracking-widest text-slate-400">CREDIT SETTLEMENT DATA</div>
                        <div className="text-xs space-y-2">
                          <p className="flex justify-between"><span className="text-slate-400">UPI GATEWAY:</span> <span className="font-black">{settings.upiId || "NOT INITIALIZED"}</span></p>
                          <p className="flex justify-between"><span className="text-slate-400">STATUS:</span> <span className="font-black text-emerald-600">VERIFIED NODE</span></p>
                        </div>
                      </div>
                      <div className="w-80 bg-black text-white p-10 space-y-4 rounded-[2rem] shadow-2xl relative overflow-hidden" style={{ backgroundColor: themeColor }}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full" />
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-70"><span>Resource Subtotal</span><span>₹70,000.00</span></div>
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-70"><span>Protocol Tax ({settings.defaultGstRate}%)</span><span>₹{(70000 * settings.defaultGstRate / 100).toFixed(2)}</span></div>
                        <div className="flex justify-between text-3xl font-black border-t border-white/20 pt-8 mt-6 font-outfit tracking-tighter"><span>TOTAL</span><span>₹{(70000 * (1 + settings.defaultGstRate / 100)).toFixed(2)}</span></div>
                      </div>
                    </div>

                    <div className="mt-24 flex justify-between px-8">
                      <div className="w-56 text-center border-t-4 border-black pt-4">
                        <div className="text-[12px] font-black uppercase tracking-tight">{settings.shopName || "COMMANDER"}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Authorized Protocol Signatory</div>
                      </div>
                      <div className="w-56 text-center border-t-4 border-black pt-4">
                        <div className="text-[12px] font-black uppercase tracking-tight">{new Date().toLocaleDateString()}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Date of Synchronization</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Bar for Mobile/Tablet */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-20 px-12 bg-white text-black hover:bg-slate-100 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 flex items-center gap-4 scale-110 active:scale-95 transition-all"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />} Commit Changes
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#02010a]"><Loader2 className="w-16 h-16 animate-spin text-[#00CF64]" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
