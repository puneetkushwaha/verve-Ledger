"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100 px-4 md:px-12">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <BrandLogo />
          
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-wider text-slate-500">
            {["Products", "Solutions", "Enterprise", "Pricing"].map(l => (
              <Link key={l} className="hover:text-[#00CF64] transition-colors flex items-center gap-1.5 group" href="#">
                {l} <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/login" className="hidden sm:block text-[13px] font-bold text-slate-500 hover:text-[#00CF64] uppercase tracking-wider transition-colors">Sign In</Link>
          <Link 
            href="/signup" 
            className="bg-[#002E25] text-white hover:bg-black px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-[11px] md:text-[13px] uppercase tracking-widest shadow-xl shadow-black/10 transition-all flex items-center gap-2"
          >
            Start <span className="hidden xs:inline">Free</span> <ArrowUpRight className="w-4 h-4" />
          </Link>
          <button 
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-2xl animate-slide-up p-6 space-y-6">
          <nav className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest text-slate-600">
            {["Products", "Solutions", "Enterprise", "Pricing"].map(l => (
              <Link key={l} className="hover:text-[#00CF64] flex justify-between items-center" href="#" onClick={() => setIsMenuOpen(false)}>
                {l} <ArrowRight className="w-4 h-4 opacity-30" />
              </Link>
            ))}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
              <Link href="/login" className="py-4 text-center border border-slate-100 rounded-xl" onClick={() => setIsMenuOpen(false)}>SIGN IN</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
