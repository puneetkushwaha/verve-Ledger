"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings, 
  ShoppingCart,
  Bell,
  ScanBarcode,
  BrainCircuit,
  Store
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Mode", href: "/pos", icon: ShoppingCart, color: "text-[#00CF64]" },
  { name: "Invoices", href: "/invoices", icon: Receipt },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Insights", href: "/ai-insights", icon: BrainCircuit, color: "text-[#10B981]" },
  { name: "Shops", href: "/shops", icon: Store },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-900 text-white border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-black font-outfit bg-gradient-to-r from-[#00CF64] to-[#10B981] bg-clip-text text-transparent uppercase tracking-tighter">
          Verve Ledger
        </h1>
        <p className="text-xs text-slate-400 mt-1">Advanced SaaS Billing</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#00CF64]/10 text-[#00CF64] border border-[#00CF64]/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", item.color)} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[#00CF64] flex items-center justify-center font-bold text-slate-900">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-slate-500 truncate">Store Owner</p>
          </div>
        </div>
      </div>
    </div>
  );
}
