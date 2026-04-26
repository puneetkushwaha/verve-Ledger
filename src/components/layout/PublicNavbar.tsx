"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Menu, X, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-[#02010a]/50 backdrop-blur-2xl z-50 border-b border-white/5 px-4 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <BrandLogo dark={false} />
        </div>

        {/* Right Side - Nav + Auth */}
        <div className="flex items-center gap-6 md:gap-10">
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-bold uppercase tracking-[0.2em] text-white/50">
            <Link className="hover:text-white transition-colors" href="#features">Products</Link>
            <Link className="hover:text-white transition-colors" href="#analytics">Solutions</Link>
            <Link className="hover:text-white transition-colors" href="/custom-plan">Enterprise</Link>
            <Link className="hover:text-white transition-colors" href="#pricing">Pricing</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 md:gap-6 border-l border-white/10 pl-6 md:pl-10">
            <Link href="/login" className="hidden sm:block text-[12px] font-bold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors">Sign In</Link>
            <Link 
              href="/signup" 
              className="bg-[#00CF64] text-[#02010a] hover:bg-white px-5 md:px-7 py-2.5 md:py-3 rounded-xl font-black text-[11px] md:text-[12px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,207,100,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Start Free <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button 
              className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#050505] border-b border-white/5 shadow-2xl animate-slide-up p-6 space-y-6">
          <nav className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
            <Link className="hover:text-[#00CF64] flex justify-between items-center" href="#features" onClick={() => setIsMenuOpen(false)}>
              Products <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>
            <Link className="hover:text-[#00CF64] flex justify-between items-center" href="#analytics" onClick={() => setIsMenuOpen(false)}>
              Solutions <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>
            <Link className="hover:text-[#00CF64] flex justify-between items-center" href="/custom-plan" onClick={() => setIsMenuOpen(false)}>
              Enterprise <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>
            <Link className="hover:text-[#00CF64] flex justify-between items-center" href="#pricing" onClick={() => setIsMenuOpen(false)}>
              Pricing <ArrowRight className="w-4 h-4 opacity-30" />
            </Link>
            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <Link href="/login" className="py-4 text-center border border-white/10 rounded-xl text-white hover:border-[#00CF64] hover:text-[#00CF64] transition-colors" onClick={() => setIsMenuOpen(false)}>SIGN IN</Link>
            </div>
          </nav>

        </div>
      )}
    </header>
  );
}
