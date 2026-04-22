"use client";

import { Bell, Search, UserCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search products, invoices, customers..." 
            className="pl-10 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#00CF64]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-[#00CF64]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-[#00CF64] transition-colors">Vibe Store #1</p>
            <p className="text-xs text-slate-500">Premium Plan</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-[#00CF64] transition-colors" />
        </div>
      </div>
    </header>
  );
}
