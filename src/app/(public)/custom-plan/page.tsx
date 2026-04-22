"use client";

import { useState } from "react";
import { 
  Send, 
  MessageSquare, 
  Building2, 
  Phone, 
  Mail, 
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";

export default function CustomPlanPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Inquiry transmitted to the Lead Architect.");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#002E25] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
          <div className="w-24 h-24 bg-[#00CF64]/10 border border-[#00CF64]/20 rounded-[40px] flex items-center justify-center mx-auto text-[#00CF64] shadow-2xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter">Request Received</h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              Our enterprise synchronization team will contact you within 24 hours to initialize your custom matrix.
            </p>
          </div>
          <Link href="/">
            <Button className="w-full h-14 bg-[#00CF64] hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all">
              Return to Landing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#002E25] text-white selection:bg-[#00CF64]/30 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00CF64] blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981] blur-[200px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00CF64] transition-colors font-black uppercase tracking-widest text-[10px] mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Base
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Column: Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00CF64] text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-amber-400" /> Custom Enterprise Solutions
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-[0.9]">
                Bespoke <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] to-[#10B981]">Engineering.</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">
                Our custom plans are designed for high-throughput enterprises requiring dedicated resources, custom API integrations, and 24/7 mission-critical support.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Building2, text: "Multi-Location Synchronization" },
                { icon: MessageSquare, text: "Dedicated Success Architect" },
                { icon: Sparkles, text: "White-labeled ERP Experience" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-[13px] font-black uppercase tracking-widest text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#00CF64] border border-white/10">
                    <item.icon className="w-5 h-5" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#00CF64]/10 blur-[100px] rounded-full" />
            <div className="bg-[#021F19]/80 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[48px] shadow-2xl relative z-10">
              <h3 className="text-2xl font-black font-outfit uppercase tracking-tight mb-8">Inquiry Protocol</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Business Name</label>
                    <Input required placeholder="Enterprise Corp" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Phone Matrix</label>
                    <Input required placeholder="+91 XXXXX XXXXX" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Corporate Email</label>
                  <Input required type="email" placeholder="architect@business.com" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-slate-700 focus:border-[#00CF64]/50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Requirement Brief</label>
                  <Textarea required placeholder="Describe your mission-critical needs..." className="min-h-[150px] bg-white/5 border-white/10 rounded-[24px] text-white placeholder:text-slate-700 focus:border-[#00CF64]/50 p-6" />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-[#00CF64] hover:bg-[#10B981] text-white font-black uppercase tracking-widest text-[12px] rounded-[24px] shadow-[0_0_40px_rgba(0,207,100,0.2)] transition-all group"
                >
                  {loading ? "Transmitting..." : "Initialize Synchronization"}
                  <Send className="w-4 h-4 ml-3 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
