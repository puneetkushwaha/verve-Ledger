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



export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00CF64]/30 antialiased overflow-x-hidden">
      
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
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 bg-[#002E25] text-white overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-20 left-20 w-40 md:w-80 h-40 md:h-80 bg-[#00CF64] blur-[100px] md:blur-[150px] rounded-full animate-pulse" />
              <div className="absolute bottom-20 right-20 w-40 md:w-80 h-40 md:h-80 bg-[#10B981] blur-[100px] md:blur-[150px] rounded-full animate-pulse delay-1000" />
           </div>

           <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center space-y-6 md:space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#00CF64] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                 <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-amber-400" /> Enterprise Billing & Inventory
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] font-outfit uppercase">
                Complete Billing <br className="hidden sm:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] to-[#10B981]">Powering Growth.</span>
              </h1>
              
              <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight px-4">
                Verve Ledger simplifies your complex business operations. From unified POS and real-time inventory to automated invoicing and neural analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 px-4 sm:px-0">
                 <Link 
                  href="/signup" 
                  className="bg-[#00CF64] text-white hover:bg-white hover:text-[#002E25] h-14 px-8 md:px-10 text-sm md:text-base font-bold rounded-xl flex items-center justify-center transition-all shadow-lg group"
                >
                  SIGN UP FOR FREE <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#" 
                  className="bg-white/10 border border-white/20 hover:bg-white/20 h-14 px-8 md:px-10 text-sm md:text-base font-bold rounded-xl flex items-center justify-center transition-all backdrop-blur-md"
                >
                  BOOK A DEMO
                </Link>
              </div>

              {/* DASHBOARD PREVIEW */}
              <div className="pt-12 md:pt-16 max-w-5xl mx-auto relative px-2">
                 {/* Floating 3D Icons (Hidden on mobile for cleaner look) */}
                 <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 flex items-center justify-center animate-float z-20 shadow-2xl hidden lg:flex">
                    <Boxes className="w-8 h-8 text-[#00CF64]" />
                 </div>
                 <div className="absolute bottom-20 -right-10 w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 flex items-center justify-center animate-float z-20 shadow-2xl hidden lg:flex delay-700">
                    <TrendingUp className="w-10 h-10 text-[#10B981]" />
                 </div>

                 <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-1.5 md:p-4 overflow-hidden transform hover:scale-[1.01] transition-all duration-700 border border-white/10">
                    <Image 
                      src="/verve-dashboard-final.png" 
                      alt="Verve Ledger Dashboard" 
                      width={1200} 
                      height={800}
                      className="rounded-[1rem] md:rounded-[1.5rem]"
                      unoptimized
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* 3. TRUST MARQUEE */}
        <section className="py-8 md:py-16 bg-white border-b border-slate-100 overflow-hidden">
           <div className="flex whitespace-nowrap animate-marquee">
              {[1,2,3,4,5,6,1,2,3,4,5,6].map((l, i) => (
                <div key={i} className="flex items-center gap-10 md:gap-16 px-6 md:px-10 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                   <span className="text-lg md:text-2xl font-black text-[#002E25] font-outfit uppercase tracking-tighter">BRAND_{l}</span>
                   <span className="text-lg md:text-2xl font-black text-[#002E25] font-outfit uppercase tracking-tighter">ELITE_RETAIL</span>
                   <span className="text-lg md:text-2xl font-black text-[#002E25] font-outfit uppercase tracking-tighter">TECH_CORE</span>
                </div>
              ))}
           </div>
        </section>

        {/* 4. CORE FEATURES (OUR CONTENT) */}
        <section className="py-16 md:py-24 bg-[#F9FBFA]">
           <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center mb-12 md:mb-20 space-y-4">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#00CF64]">Core Capabilities</h2>
                 <p className="text-2xl sm:text-4xl md:text-5xl font-black text-[#002E25] font-outfit tracking-tighter leading-tight">
                    Every tool you need to <br className="hidden sm:block" /> dominate your market.
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
                   <div key={i} className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 hover:border-[#00CF64] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                      <div className="w-12 md:w-14 h-12 md:h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-[#00CF64] transition-all">
                         <f.icon className="w-6 md:w-7 h-6 md:h-7 text-[#00CF64] group-hover:text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-[#002E25] font-outfit mb-3 md:mb-4">{f.title}</h3>
                      <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 5. VERVE NOVA TECHNOLOGIES (THE HUMAN STORY) */}
        <section className="py-16 md:py-24 bg-white border-y border-slate-100">
           <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="relative group px-4 md:px-0">
                 <div className="absolute -inset-4 bg-emerald-600/10 blur-[80px] rounded-full group-hover:bg-emerald-600/20 transition-all duration-1000" />
                 <Image 
                    src="/tech-leader.png" 
                    alt="Verve Nova Engineering Lead" 
                    width={800} 
                    height={800}
                    className="rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                    unoptimized
                 />
              </div>
              <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                 <div className="space-y-4 md:space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#10B981]">The Architects</h2>
                    <p className="text-3xl sm:text-5xl md:text-6xl font-black text-[#002E25] font-outfit tracking-tighter leading-tight">
                       Human-Centric <br /> Engineering.
                    </p>
                 </div>
                 <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-500 font-medium leading-relaxed px-2 md:px-0">
                    <p>
                       <strong>Verve Nova Technologies</strong> is a premier engineering firm based in <strong>Lucknow, India</strong>. We believe that mission-critical software should be as intuitive as it is powerful.
                    </p>
                    <p>
                       <strong>Verve Ledger</strong> is our flagship solution, built to solve the real-world challenges faced by retail leaders every day.
                    </p>
                 </div>
                 <div className="flex justify-center lg:justify-start gap-8 md:gap-12 pt-4">
                    <div className="space-y-1">
                       <p className="text-2xl md:text-3xl font-black text-[#002E25] font-outfit uppercase">LKO/IN</p>
                       <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Base of Operations</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-2xl md:text-3xl font-black text-[#002E25] font-outfit uppercase">24/7</p>
                       <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Monitoring</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. ANALYTICS PREVIEW */}
        <section className="py-16 md:py-24 bg-[#002E25] text-white relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                 <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white font-outfit tracking-tighter leading-tight">
                    Intelligence <br /> At Your Fingertips.
                 </h2>
                 <p className="text-base md:text-lg text-slate-300 font-medium leading-relaxed px-2 md:px-0">
                    Stop guessing and start growing. Our neural analytics engine transforms your raw data into actionable insights.
                 </p>
                 <ul className="space-y-4 inline-block lg:block text-left">
                    {["Real-time revenue tracking", "Predictive stock replenishment", "Churn and retention metrics"].map(item => (
                      <li key={item} className="flex items-center gap-3 font-bold text-slate-100 text-sm md:text-base">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#00CF64]" /> {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-white/10 shadow-3xl">
                 <div className="space-y-8 md:space-y-10">
                    {[
                      { l: "Monthly Revenue", v: "₹4.2M", p: "85%", c: "bg-[#00CF64]" },
                      { l: "Inventory Health", v: "Optimal", p: "95%", c: "bg-emerald-400" },
                      { l: "Store Efficiency", v: "92%", p: "70%", c: "bg-[#10B981]" }
                    ].map((s, i) => (
                      <div key={i} className="space-y-3 md:space-y-4">
                         <div className="flex justify-between items-end">
                            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">{s.l}</p>
                            <p className="text-white font-black text-xl md:text-2xl font-outfit">{s.v}</p>
                         </div>
                         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", s.c)} style={{ width: s.p }} />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 7. SUBSCRIPTION PLANS */}
        <section className="py-20 md:py-32 bg-white relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center mb-16 md:mb-24 space-y-4">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#00CF64]">Subscription Plans</h2>
                 <p className="text-3xl sm:text-5xl md:text-6xl font-black text-[#002E25] font-outfit tracking-tighter leading-[0.9]">
                    Scaling with your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CF64] to-[#10B981]">Ambition.</span>
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
                     "relative p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border transition-all duration-700 hover:-translate-y-4 flex flex-col h-full",
                     plan.popular 
                       ? "bg-[#002E25] text-white border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.3)]" 
                       : "bg-[#F9FBFA] text-[#002E25] border-slate-100 hover:border-[#00CF64]"
                   )}>
                      {plan.popular && (
                        <div className="absolute top-0 right-1/2 translate-x-1/2 lg:right-12 lg:translate-x-0 -translate-y-1/2 bg-gradient-to-r from-[#00CF64] to-[#10B981] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2 rounded-full shadow-xl whitespace-nowrap">
                           Most Popular
                        </div>
                      )}
                      <div className="space-y-6 mb-8 md:mb-12 flex-grow">
                         <h3 className="text-xl md:text-2xl font-black font-outfit uppercase tracking-widest">{plan.name}</h3>
                         <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black font-outfit">{plan.price}</span>
                            {plan.price !== "Custom" && <span className="text-xs md:text-sm font-bold opacity-60">{(plan as any).duration}</span>}
                         </div>
                         <p className="text-sm md:text-base font-medium opacity-60 leading-relaxed">{plan.desc}</p>
                         <div className="h-px bg-current opacity-10 w-full" />
                         <ul className="space-y-4">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                 <div className={cn(
                                   "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                   plan.popular ? "bg-[#00CF64]" : "bg-emerald-100 text-emerald-600"
                                 )}>
                                    <Check className="w-3 h-3 text-white" strokeWidth={4} />
                                 </div>
                                 {f}
                              </li>
                            ))}
                         </ul>
                      </div>
                      <Link 
                        href={plan.name === "Enterprise" ? "/custom-plan" : "/signup"} 
                        className={cn(
                          "h-14 md:h-16 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center transition-all",
                          plan.popular 
                            ? "bg-[#00CF64] text-white hover:bg-white hover:text-black" 
                            : "bg-[#002E25] text-white hover:bg-[#00CF64]"
                        )}
                      >
                        SELECT {plan.name} PLAN <ArrowUpRight className="ml-2 w-4 h-4" />
                      </Link>

                   </div>
                 ))}
              </div>
              
              <div className="mt-16 md:mt-20 text-center px-4">
                 <p className="text-slate-400 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.5em] mb-4">Powered by Verve Nova Technologies</p>
                 <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-black text-slate-300 uppercase tracking-widest">
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
