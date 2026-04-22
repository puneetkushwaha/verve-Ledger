"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Store, 
  Palette, 
  Type, 
  Save, 
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
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
    terms: ""
  });

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
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00CF64]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">System Configuration</h1>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Customize your matrix environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shop Profile */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#050505] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#00CF64]">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black font-outfit text-white uppercase tracking-tight">Identity Matrix</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public shop information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Shop Designation</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                    <Input 
                      value={settings.shopName}
                      onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Communication Node (Email)</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                    <Input 
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Voice Link (Phone)</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                    <Input 
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Geographic Coordinates (Address)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                    <Input 
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#050505] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#00CF64]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black font-outfit text-white uppercase tracking-tight">Ledger Logic</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invoice prefix and terms</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Invoice Serial Prefix</label>
                <Input 
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({...settings, invoicePrefix: e.target.value})}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-white text-lg font-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Universal Terms & Conditions</label>
                <textarea 
                  rows={4}
                  value={settings.terms}
                  onChange={(e) => setSettings({...settings, terms: e.target.value})}
                  className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white focus:ring-1 focus:ring-[#00CF64]/30 outline-none transition-all font-medium text-sm"
                  placeholder="Enter shop terms here..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Branding & Theme */}
        <div className="space-y-8">
          <Card className="bg-[#050505] border-white/5 shadow-2xl rounded-[3rem] overflow-hidden sticky top-32">
            <CardHeader className="p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#00CF64]">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black font-outfit text-white uppercase tracking-tight">Verve Aesthetic</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual brand identity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4 block">Invoice Theme Chroma</label>
                <div className="grid grid-cols-5 gap-3">
                  {["#00CF64", "#3B82F6", "#8B5CF6", "#F43F5E", "#F59E0B"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSettings({...settings, themeColor: color})}
                      className={cn(
                        "w-full aspect-square rounded-xl border-4 transition-all",
                        settings.themeColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="relative mt-2">
                   <Input 
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => setSettings({...settings, themeColor: e.target.value})}
                      className="h-12 w-full bg-white/5 border-white/10 rounded-xl cursor-pointer"
                   />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4 block">Institutional Typography</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Inter", "Outfit", "Roboto Mono", "Space Grotesk"].map((font) => (
                    <button
                      key={font}
                      onClick={() => setSettings({...settings, fontFamily: font})}
                      className={cn(
                        "w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                        settings.fontFamily === font 
                          ? "bg-[#00CF64] border-transparent text-white shadow-lg" 
                          : "bg-white/5 border-white/10 text-slate-500 hover:text-white"
                      )}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-16 bg-white text-black hover:bg-slate-200 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition-all"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Commit Changes</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
