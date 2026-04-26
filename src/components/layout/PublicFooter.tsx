"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function PublicFooter() {
  return (
    <footer className="relative bg-[#02010a] pt-16 md:pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* Background Glow & Watermark */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#00CF64]/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-[10rem] bg-[#00CF64] blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 md:bottom-2 left-0 w-full overflow-hidden pointer-events-none select-none">
        <div className="flex whitespace-nowrap animate-marquee opacity-70">
          {[1,2,3,4].map((i) => (
            <div key={i} className="text-[12vw] md:text-[14vw] font-black text-white/[0.05] tracking-tighter font-outfit leading-none px-4">
              VERVE NOVA TECHNOLOGIES • 
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-16 mb-12 md:mb-16">
          <div className="col-span-2 lg:col-span-1 space-y-6 md:space-y-8 text-center lg:text-left">
            <BrandLogo showSubtext={false} dark={false} className="justify-center lg:justify-start" />
            <p className="text-white/40 text-sm md:text-base font-medium leading-relaxed max-w-xs mx-auto lg:mx-0">
              Institutional-grade technology for modern business scaling and operational dominance.
            </p>
          </div>
          {[
            { t: "Platform", l: ["Point of Sale", "Inventory Sync", "Invoicing", "Mobile App"] },
            { t: "Solutions", l: ["Retail Chains", "Service Centers", "E-commerce", "Enterprise"] },
            { t: "Company", l: ["About Verve", "Contact Us", "Careers", "Legal & Privacy"] },
            { t: "Resources", l: ["Documentation", "API Reference", "Community", "Support Hub"] }
          ].map((c, i) => (
            <div key={i} className="text-center sm:text-left">
              <h5 className="font-black text-[11px] text-white uppercase tracking-[0.3em] mb-6 md:mb-8">{c.t}</h5>
              <ul className="space-y-4 md:space-y-5 text-[13px] md:text-[14px] text-white/50 font-bold tracking-wide">
                {c.l.map(item => <li key={item} className="hover:text-white cursor-pointer transition-colors">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
          <p className="text-white/30 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
            © 2026 Billzer | Engineered by <a href="https://www.vervenovatech.com/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#00CF64] transition-colors ml-1">VERVE NOVA TECHNOLOGIES</a>
          </p>
          <div className="flex gap-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">
            <Link href="#" className="text-white/30 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-white/30 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
