"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, User, Mail, Lock, Phone, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Account created! Please login.");
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02010a] text-white selection:bg-[#00CF64]/30 overflow-hidden relative flex flex-col items-center justify-center py-20 px-6">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00CF64] blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981] blur-[200px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Top Logo */}
      <div className="relative z-10 mb-10">
        <BrandLogo dark={false} showSubtext={true} />
      </div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 animate-slide-up">
        {/* Left Column: Branding */}
        <div className="hidden lg:block space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00CF64] text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400" /> Genesis Initialization
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.9]">
              Deploy Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] to-[#10B981]">Matrix.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">
              Join the elite retail network. Initialize your enterprise node with unified POS, inventory tracking, and neural analytics.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-[11px]">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/10">
                <Store className="w-4 h-4" />
              </div>
              Multi-Store Sync Support
            </div>
            <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-[11px]">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/10">
                <Lock className="w-4 h-4" />
              </div>
              Institutional Grade Security
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <Card className="bg-[#021F19]/80 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Protocol: Signup</CardTitle>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Enterprise Node Deployment</p>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-10 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Retail Entity Name</label>
                <div className="relative group">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                  <Input 
                    required
                    placeholder="Verve Nova Lucknow" 
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Lead Architect</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                    <Input 
                      required
                      placeholder="Name" 
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Comms Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                    <Input 
                      required
                      placeholder="+91..." 
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                  <Input 
                    required
                    type="email"
                    placeholder="arch@enterprise.com" 
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-10 pt-0 flex flex-col gap-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-[#00CF64] hover:bg-[#10B981] text-white font-black uppercase tracking-widest text-[12px] rounded-[24px] shadow-[0_0_40px_rgba(0,207,100,0.2)] transition-all group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Deploy Node <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" /></>}
              </Button>
              <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Existing Identity? <Link href="/login" className="text-[#00CF64] hover:text-white transition-colors">Sign In Matrix</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
