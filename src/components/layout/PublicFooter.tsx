"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 md:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-16 mb-16 md:mb-24">
          <div className="col-span-2 lg:col-span-1 space-y-6 md:space-y-8 text-center lg:text-left">
            <BrandLogo showSubtext={false} />
            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed">
              Institutional-grade technology for modern business growth.
            </p>
          </div>
          {[
            { t: "Product", l: ["POS", "Inventory", "Invoicing", "Mobile"] },
            { t: "Solutions", l: ["Retail", "Services", "E-com", "Enterprise"] },
            { t: "Company", l: ["About Us", "Contact", "Careers", "Legal"] },
            { t: "Help", l: ["Docs", "API", "Community", "Support"] }
          ].map((c, i) => (
            <div key={i} className="text-center sm:text-left">
              <h5 className="font-black text-[10px] text-slate-900 uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10">{c.t}</h5>
              <ul className="space-y-3 md:space-y-5 text-sm md:text-[15px] text-slate-400 font-bold">
                {c.l.map(item => <li key={item} className="hover:text-[#00CF64] cursor-pointer transition-colors">{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center">
          <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">© 2026 Verve Ledger | Engineered by Verve Nova Technologies</p>
          <div className="flex gap-8 md:gap-12 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            <Link href="#" className="text-slate-400 hover:text-[#00CF64] transition-colors opacity-60">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-[#00CF64] transition-colors opacity-60">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
