"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2,
  ChevronDown,
  Globe,
  Settings,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  CreditCard,
  History,
  TrendingUp,
  Mail,
  Smartphone,
  PieChart,
  Users,
  Repeat,
  Sparkles,
  ArrowUpRight,
  Flame,
  Activity,
  Boxes,
  Cpu,
  Workflow,
  Search,
  ShoppingCart,
  BarChart3,
  ShieldAlert,
  Check,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RazorpayScript } from "@/components/payments/RazorpayScript";




export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handleSubscribe = async (plan: any) => {
    if (!session) {
      toast.info("Please login to subscribe to a plan.");
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (plan.price === "Custom") {
      router.push("/custom-plan");
      return;
    }

    setLoading(plan.name);

    try {
      const amount = plan.name === "Monthly Pro" ? 999 : 4999;
      const planId = plan.name === "Monthly Pro" ? "MONTHLY" : "YEARLY";

      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          planId,
          shopId: (session?.user as any)?.shopId,
        }),
      });

      const order = await res.json();

      if (!res.ok) throw new Error(order.error || "Failed to create order");

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Billzer",
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          toast.success("Payment Successful! Activating your plan...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#00CF64",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-[#02010a] text-white font-sans selection:bg-[#00CF64]/30 antialiased overflow-x-hidden">
      <RazorpayScript />
      <style jsx global>{`

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>



      <main className="flex-1">
        
        {/* 2. BALANCED HERO SECTION */}
        <section className="relative pt-32 md:pt-48 pb-16 md:pb-20 bg-[#02010a] text-white overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-64 md:w-[30rem] h-64 md:h-[30rem] bg-[#00CF64] blur-[120px] md:blur-[200px] rounded-full animate-pulse opacity-20" />
              <div className="absolute bottom-1/4 right-1/4 w-64 md:w-[30rem] h-64 md:h-[30rem] bg-indigo-500 blur-[120px] md:blur-[200px] rounded-full animate-pulse delay-1000 opacity-20" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
           </div>

           <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center space-y-8 md:space-y-10 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[#00CF64] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,207,100,0.2)]">
                 <Sparkles className="w-4 h-4 text-amber-400" /> Enterprise Intelligence Matrix
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] font-outfit uppercase">
                The Ultimate <br className="hidden sm:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] via-emerald-400 to-[#10B981] drop-shadow-[0_0_40px_rgba(0,207,100,0.5)]">Business Protocol.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-bold leading-relaxed tracking-widest uppercase text-[10px] md:text-xs px-4">
                Command your empire with Billzer. Unified POS, multi-node inventory synchronization, and neural analytics engineered for absolute market dominance.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6 px-4 sm:px-0">
                 <Link 
                  href="/signup" 
                  className="bg-[#00CF64] text-black hover:bg-white h-16 px-12 text-xs font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center transition-all shadow-[0_20px_50px_rgba(0,207,100,0.3)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 group"
                >
                  INITIALIZE SYSTEM <ArrowUpRight className="ml-3 w-5 h-5 group-hover:rotate-45 transition-transform" />
                </Link>
                <Link 
                  href="#pricing" 
                  className="bg-white/5 border border-white/10 hover:bg-white/10 h-16 px-12 text-xs font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center transition-all backdrop-blur-md text-white hover:scale-105 active:scale-95"
                >
                  VIEW PROTOCOLS
                </Link>
              </div>

              {/* FULL-WIDTH 4-DEVICE SHOWCASE */}
              <div className="pt-20 md:pt-32 w-full relative">
                 {/* The "Desk" Base */}
                 <div className="absolute bottom-0 left-0 w-full h-8 md:h-12 bg-gradient-to-b from-[#111] to-[#02010a] border-t border-[#333] z-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]" />

                 <div className="w-full max-w-[1400px] mx-auto flex items-end justify-center gap-3 md:gap-6 lg:gap-8 px-4 relative z-10 pb-[1px] overflow-x-auto snap-x hide-scrollbar">

                    {/* 1. LAPTOP (Far Left) */}
                    <div className="hidden lg:block shrink-0 w-[160px] xl:w-[200px] 2xl:w-[240px] mb-1 snap-center group">
                       <div className="bg-[#050505] p-2 pb-0 rounded-t-xl border border-[#222] border-b-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative">
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black border border-[#222]" />
                          <div className="bg-[#02010a] rounded-t-lg overflow-hidden border border-[#222] border-b-0 h-[100px] xl:h-[130px] 2xl:h-[150px]">
                             <Image src="/executive-dashboard.png" alt="Laptop" width={800} height={500} className="w-full h-full object-cover object-left-top opacity-80 group-hover:opacity-100 transition-opacity duration-500" unoptimized />
                          </div>
                       </div>
                       <div className="relative w-[110%] -ml-[5%] h-2 bg-gradient-to-b from-[#222] to-[#0A0A0A] rounded-b-md border-t border-[#333] flex justify-center">
                          <div className="w-10 h-full bg-[#111] rounded-b-sm shadow-inner" />
                       </div>
                    </div>

                    {/* 2. DESKTOP MONITOR (Centerpiece) */}
                    <div className="shrink-0 w-[220px] md:w-[320px] lg:w-[400px] xl:w-[480px] 2xl:w-[560px] relative snap-center group">
                       {/* Stand */}
                       <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-20 lg:w-24 h-8 md:h-10 lg:h-12 bg-gradient-to-b from-[#222] to-[#111] border-x border-t border-[#333] rounded-t-md z-0" />
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 md:w-32 lg:w-36 h-1.5 bg-gradient-to-t from-[#0A0A0A] to-[#222] border-t border-[#444] rounded-t-md z-0" />
                       
                       {/* Monitor Frame */}
                       <div className="bg-[#050505] p-1.5 md:p-2 lg:p-2.5 pb-0 rounded-xl md:rounded-2xl border border-[#222] shadow-[0_-15px_40px_rgba(0,207,100,0.1)] relative z-10 mb-6 md:mb-8 lg:mb-10 transform group-hover:-translate-y-2 transition-transform duration-700">
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-black border border-[#222]" />
                          <div className="bg-[#02010a] rounded-lg md:rounded-xl overflow-hidden border border-[#222] h-[120px] md:h-[180px] lg:h-[220px] xl:h-[270px] 2xl:h-[310px]">
                             <Image src="/executive-dashboard.png" alt="Desktop" width={1600} height={900} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500" unoptimized />
                          </div>
                          {/* Monitor Chin */}
                          <div className="h-4 md:h-5 lg:h-6 w-full bg-[#050505] rounded-b-xl md:rounded-b-2xl flex items-center justify-center">
                             <span className="text-[4px] md:text-[5px] font-black text-[#333] tracking-widest uppercase">Verve</span>
                          </div>
                       </div>
                    </div>

                    {/* 3. TABLET (Right) */}
                    <div className="hidden md:block shrink-0 w-[120px] lg:w-[140px] xl:w-[160px] 2xl:w-[180px] mb-1 snap-center group">
                       <div className="bg-[#050505] p-1.5 md:p-2 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-[#222] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative transform group-hover:-translate-y-1 transition-transform duration-500">
                          <div className="absolute top-1/2 right-1 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-black border border-[#222] hidden" />
                          <div className="bg-[#02010a] rounded-lg md:rounded-xl overflow-hidden border border-[#222] h-[160px] lg:h-[190px] xl:h-[210px] 2xl:h-[240px]">
                             <Image src="/executive-dashboard.png" alt="Tablet" width={600} height={800} className="w-full h-full object-cover object-left opacity-80 group-hover:opacity-100 transition-opacity duration-500" unoptimized />
                          </div>
                       </div>
                    </div>

                    {/* 4. MOBILE PHONE (Far Right) */}
                    <div className="shrink-0 w-[60px] md:w-[70px] lg:w-[80px] xl:w-[90px] 2xl:w-[100px] mb-1 snap-center group">
                       <div className="bg-[#050505] p-1 md:p-1.5 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-[#222] shadow-[0_-10px_30px_rgba(0,0,0,0.6)] relative transform group-hover:-translate-y-2 transition-transform duration-500">
                          <div className="absolute top-1 md:top-1.5 left-1/2 -translate-x-1/2 w-4 md:w-5 h-0.5 bg-black rounded-full z-40 border border-[#222]" /> {/* Notch */}
                          <div className="bg-[#02010a] rounded-lg md:rounded-xl overflow-hidden border border-[#222] h-[120px] md:h-[140px] lg:h-[160px] xl:h-[180px] 2xl:h-[200px] relative">
                             <Image src="/executive-dashboard.png" alt="Mobile" width={400} height={800} className="w-full h-full object-cover object-left opacity-90 group-hover:opacity-100 transition-opacity duration-500" unoptimized />
                          </div>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </section>

        {/* 3. TRUST MARQUEE */}
        <section className="py-8 md:py-12 bg-[#02010a] border-y border-white/5 overflow-hidden">
           <div className="flex whitespace-nowrap animate-marquee">
              {[1,2,3,4,5,6,1,2,3,4,5,6].map((l, i) => (
                <div key={i} className="flex items-center gap-10 md:gap-16 px-6 md:px-10 opacity-20 hover:opacity-100 transition-all cursor-default">
                   <span className="text-lg md:text-xl font-black text-white font-outfit uppercase tracking-[0.2em]">VERVE NOVA TECH</span>
                   <span className="text-lg md:text-xl font-black text-[#00CF64] font-outfit uppercase tracking-[0.2em]">VNT</span>
                   <span className="text-lg md:text-xl font-black text-white font-outfit uppercase tracking-[0.2em]">VERVE NOVA TECHNOLOGIES</span>
                </div>
              ))}
           </div>
        </section>

        {/* 4. CORE FEATURES (OUR CONTENT) */}
        <section id="features" className="py-20 md:py-32 bg-[#050505] relative">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#00CF6415_0%,transparent_70%)] pointer-events-none" />
           <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center mb-16 md:mb-24 space-y-6">
                 <div className="inline-flex items-center justify-center">
                    <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-[#00CF64] bg-[#00CF64]/10 px-6 py-2 rounded-full border border-[#00CF64]/20">Core Capabilities</h2>
                 </div>
                 <p className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-[1.1] uppercase">
                    Every tool you need to <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00CF64]">dominate your market.</span>
                 </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                 {[
                   { title: "Unified POS System", desc: "Process sales faster with our high-speed, intuitive point-of-sale that works online and offline.", icon: ShoppingCart },
                   { title: "Real-time Inventory", desc: "Never miss a sale. Track stock levels across multiple warehouses and channels automatically.", icon: Boxes },
                   { title: "Automated Invoicing", desc: "Generate professional tax invoices, send reminders, and track payments without lifting a finger.", icon: CreditCard },
                   { title: "Customer Database", desc: "Build loyalty by tracking purchase history and managing customer profiles in one central hub.", icon: Users },
                   { title: "Neural Analytics", desc: "Get deep insights into your revenue, top products, and growth trends with live data visualization.", icon: BarChart3 },
                   { title: "Multi-store Sync", desc: "Manage 1 or 100 stores from a single dashboard. Synchronize data instantly across your entire network.", icon: Globe }
                 ].map((f, i) => (
                   <div key={i} className="bg-[#0A0A0A] p-8 md:p-10 rounded-[2rem] border border-white/5 hover:border-[#00CF64]/50 hover:bg-white/[0.02] hover:shadow-[0_20px_50px_rgba(0,207,100,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00CF64]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#00CF64]/20 transition-all duration-700" />
                      <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-8 group-hover:bg-[#00CF64] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 shadow-xl">
                         <f.icon className="w-6 h-6 text-[#00CF64] group-hover:text-black" />
                      </div>
                      <h3 className="text-xl font-black text-white font-outfit tracking-wider uppercase mb-3 relative z-10">{f.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed font-bold tracking-widest uppercase text-[9px] relative z-10">{f.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 5. VERVE NOVA TECHNOLOGIES (THE HUMAN STORY) */}
        <section className="py-20 md:py-32 bg-[#050505] border-y border-white/5 relative overflow-hidden">
           <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00CF64]/5 blur-[100px] rounded-full -translate-y-1/2 -ml-48 pointer-events-none" />
           <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
              <div className="relative group px-4 md:px-0">
                 <div className="absolute -inset-4 bg-[#00CF64]/10 blur-[60px] rounded-full group-hover:bg-[#00CF64]/20 transition-all duration-1000" />
                 <Image 
                    src="/tech-leader.png" 
                    alt="Verve Nova Engineering Lead" 
                    width={800} 
                    height={800}
                    className="rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10 grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                    unoptimized
                 />
              </div>
              <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                 <div className="space-y-4 md:space-y-6">
                    <div className="inline-flex items-center justify-center lg:justify-start">
                       <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-[#00CF64] bg-[#00CF64]/10 px-6 py-2 rounded-full border border-[#00CF64]/20">The Architects</h2>
                    </div>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-[1.05] uppercase">
                       Human-Centric <br /> Engineering.
                    </p>
                 </div>
                 <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-400 font-bold leading-relaxed px-2 md:px-0 tracking-widest uppercase text-[9px] md:text-[10px]">
                    <p>
                       <span className="text-[#00CF64]">Verve Nova Technologies</span> is a premier engineering firm based in <span className="text-white">Lucknow, India</span>. We believe that mission-critical software should be as intuitive as it is powerful.
                    </p>
                    <p>
                       <span className="text-white">Billzer</span> is our flagship solution, built to solve the real-world challenges faced by retail leaders every day.
                    </p>
                 </div>
                 <div className="flex justify-center lg:justify-start gap-12 md:gap-16 pt-6">
                    <div className="space-y-2">
                       <p className="text-3xl md:text-4xl font-black text-white font-outfit uppercase tracking-tighter">LKO/IN</p>
                       <p className="text-[9px] font-black text-[#00CF64] uppercase tracking-widest">Base of Operations</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-3xl md:text-4xl font-black text-white font-outfit uppercase tracking-tighter">24/7</p>
                       <p className="text-[9px] font-black text-[#00CF64] uppercase tracking-widest">Monitoring</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. ANALYTICS PREVIEW */}
        <section id="analytics" className="py-20 md:py-32 bg-[#02010a] text-white relative overflow-hidden">
           <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-[#00CF64]/5 blur-[150px] rounded-full pointer-events-none" />
           <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
              <div className="space-y-8 md:space-y-10 text-center lg:text-left">
                 <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white font-outfit tracking-tighter leading-[1.05] uppercase">
                    Intelligence <br /> <span className="text-[#00CF64]">At Your Fingertips.</span>
                 </h2>
                 <p className="text-sm md:text-sm text-slate-400 font-bold leading-relaxed px-2 md:px-0 uppercase tracking-widest">
                    Stop guessing and start growing. Our neural analytics engine transforms your raw data into actionable insights instantly.
                 </p>
                 <ul className="space-y-5 inline-block lg:block text-left">
                    {["Real-time revenue tracking", "Predictive stock replenishment", "Churn and retention metrics"].map(item => (
                      <li key={item} className="flex items-center gap-4 font-black text-white text-[10px] md:text-xs uppercase tracking-widest bg-white/5 border border-white/10 px-6 py-4 rounded-xl shadow-lg">
                        <div className="w-6 h-6 rounded-full bg-[#00CF64]/20 flex items-center justify-center shrink-0">
                           <Zap className="w-3 h-3 text-[#00CF64]" />
                        </div> 
                        {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-[#050505] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                 <div className="space-y-10 md:space-y-12 relative z-10">
                    {[
                      { l: "Monthly Revenue", v: "₹4.2M", p: "85%", c: "bg-[#00CF64]" },
                      { l: "Inventory Health", v: "Optimal", p: "95%", c: "bg-emerald-400" },
                      { l: "Store Efficiency", v: "92%", p: "70%", c: "bg-[#10B981]" }
                    ].map((s, i) => (
                      <div key={i} className="space-y-4 md:space-y-5">
                         <div className="flex justify-between items-end">
                            <p className="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">{s.l}</p>
                            <p className="text-white font-black text-2xl md:text-3xl font-outfit">{s.v}</p>
                         </div>
                         <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <div className={cn("h-full transition-all duration-1000 relative shadow-[0_0_20px_rgba(0,207,100,0.5)]", s.c)} style={{ width: s.p }}>
                               <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent to-white/30" />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>        {/* 7. SUBSCRIPTION PLANS */}
        <section id="pricing" className="py-20 md:py-32 bg-[#02010a] relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-[#00CF64]/5 blur-[120px] rounded-full pointer-events-none" />
           <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
              <div className="text-center mb-16 md:mb-24 space-y-6">
                 <div className="inline-flex items-center justify-center">
                    <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-[#00CF64] bg-[#00CF64]/10 px-6 py-2 rounded-full border border-[#00CF64]/20">Subscription Protocols</h2>
                 </div>
                 <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-[1.05] uppercase">
                    Scaling with your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] via-emerald-400 to-[#10B981] drop-shadow-[0_0_30px_rgba(0,207,100,0.5)]">Ambition.</span>
                 </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                 {[
                   { 
                     name: "Monthly Pro", 
                     price: "₹999", 
                     desc: "Perfect for single-store retail shops looking to digitize.",
                     features: ["Single Store Access", "Unified POS", "Basic Inventory", "Email Support", "5 Users Max"],
                     popular: false,
                     duration: "/month"
                   },
                   { 
                     name: "Yearly Elite", 
                     price: "₹4,999", 
                     desc: "Designed for growing businesses with multiple locations.",
                     features: ["Up to 5 Stores", "Real-time Multi-sync", "Neural Analytics", "24/7 Priority Support", "Unlimited Users"],
                     popular: true,
                     duration: "/year"
                   },
                   { 
                     name: "Enterprise", 
                     price: "Custom", 
                     desc: "High-performance infrastructure for large retail chains.",
                     features: ["Unlimited Stores", "Dedicated R&D Architect", "Custom API Access", "White-label Portal", "SLA Guarantee"],
                     popular: false
                   }
                 ].map((plan, i) => (
                   <div key={i} className={cn(
                     "relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-700 hover:-translate-y-4 flex flex-col h-full",
                     plan.popular 
                       ? "bg-[#050505] text-white border-[#00CF64]/50 shadow-[0_0_80px_rgba(0,207,100,0.15)] z-20 scale-105" 
                       : "bg-[#0A0A0A] text-white border-white/5 hover:border-[#00CF64]/30 z-10"
                   )}>
                      {plan.popular && (
                        <div className="absolute top-0 right-1/2 translate-x-1/2 lg:right-12 lg:translate-x-0 -translate-y-1/2 bg-[#00CF64] text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest px-6 md:px-8 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,207,100,0.4)] whitespace-nowrap">
                           Most Popular
                        </div>
                      )}
                      <div className="space-y-6 mb-8 md:mb-12 flex-grow">
                         <h3 className="text-xl md:text-2xl font-black font-outfit uppercase tracking-[0.2em]">{plan.name}</h3>
                         <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black font-outfit drop-shadow-md">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">{(plan as any).duration}</span>}
                         </div>
                         <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">{plan.desc}</p>
                         <div className="h-px bg-white/10 w-full" />
                         <ul className="space-y-5 pt-2">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest">
                                 <div className={cn(
                                   "w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                                   plan.popular ? "bg-[#00CF64] text-black" : "bg-white/5 text-[#00CF64] border border-white/10"
                                 )}>
                                    <Check className="w-3.5 h-3.5" strokeWidth={4} />
                                 </div>
                                 {f}
                              </li>
                            ))}
                         </ul>
                      </div>
                      <button 
                        onClick={() => handleSubscribe(plan)}
                        disabled={loading === plan.name}
                        className={cn(
                          "h-14 md:h-16 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center transition-all w-full group overflow-hidden relative",
                          plan.popular 
                            ? "bg-[#00CF64] text-black hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]" 
                            : "bg-white/5 text-white border border-white/10 hover:bg-[#00CF64] hover:text-black hover:border-transparent"
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {loading === plan.name ? "INITIALIZING..." : `SELECT ${plan.name} PLAN`} <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        </span>
                      </button>
                   </div>
                 ))}
              </div>
              
              <div className="mt-20 md:mt-32 text-center px-4">
                 <p className="text-[#00CF64] font-black text-[9px] md:text-[10px] uppercase tracking-[0.5em] mb-6">Powered by Verve Nova Technologies</p>
                 <div className="flex flex-wrap justify-center gap-4 md:gap-10 text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Precision Engineering</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Lucknow Hub</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Mission Critical</span>
                 </div>
              </div>
           </div>
        </section>

      </main>


    </div>
  );
}
