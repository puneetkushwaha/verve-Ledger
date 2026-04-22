"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002E25] text-white selection:bg-[#00CF64]/30 overflow-hidden relative flex items-center justify-center py-20 px-6">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00CF64] blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981] blur-[200px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 animate-slide-up">
        {/* Left Column: Branding */}
        <div className="hidden lg:block space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00CF64] text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[#00CF64]" /> Secure Identity Node
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.9]">
              Re-Establish <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] to-[#10B981]">Connection.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">
              Access your enterprise matrix. Securely manage your retail operations, inventory, and transaction telemetry.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-[11px]">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/10">
                <Sparkles className="w-4 h-4" />
              </div>
              Real-time Analytics Enabled
            </div>
            <div className="flex items-center gap-3 text-slate-300 font-bold uppercase tracking-widest text-[11px]">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/10">
                <Lock className="w-4 h-4" />
              </div>
              End-to-End Encrypted Login
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <Card className="bg-[#021F19]/80 backdrop-blur-3xl border border-white/10 rounded-[48px] shadow-2xl overflow-hidden">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">Protocol: Authorize</CardTitle>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Secure Matrix Entry</p>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">System Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                  <Input 
                    required
                    type="email"
                    placeholder="architect@node.com" 
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Master Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
                  <Input 
                    required
                    type="password"
                    placeholder="••••••••" 
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <input type="checkbox" className="w-4 h-4 bg-white/5 border-white/10 rounded text-[#00CF64] focus:ring-[#00CF64]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Maintain Link</span>
                </div>
                <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-[#00CF64] p-0 h-auto">Recover Key</Button>
              </div>
            </CardContent>

            <CardFooter className="p-10 pt-0 flex flex-col gap-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 bg-[#00CF64] hover:bg-[#10B981] text-white font-black uppercase tracking-widest text-[12px] rounded-[24px] shadow-[0_0_40px_rgba(0,207,100,0.2)] transition-all group"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Establish Link <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" /></>}
              </Button>
              <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                New Architect? <Link href="/signup" className="text-[#00CF64] hover:text-white transition-colors">Initialize Identity</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
