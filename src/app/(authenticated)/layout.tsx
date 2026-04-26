"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Store,
  ShieldCheck,
  Crown,
  AlertTriangle,
  Menu,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
  Activity,
  Box,
  Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = session?.user as any;
  const userRole = user?.role || "USER";
  const isAdmin = userRole === "ADMIN";
  const isOwner = userRole === "OWNER";

  const planExpiry = user?.planExpiry ? new Date(user.planExpiry) : null;
  const isExpired = planExpiry && planExpiry < new Date();
  const isTrial = user?.plan === "TRIAL";

  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (status === "authenticated" && isOwner && isExpired && pathname !== "/subscription") {
      router.push("/subscription");
    }
  }, [status, isOwner, isExpired, pathname, router]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["OWNER", "USER", "ADMIN"] },
    { icon: ShoppingCart, label: "Billing", href: "/pos", roles: ["OWNER", "USER"] },
    { icon: Box, label: "Inventory", href: "/inventory", roles: ["OWNER", "USER"] },
    { icon: FileText, label: "Bill History", href: "/invoices", roles: ["OWNER", "USER", "ADMIN"] },
    { icon: Fingerprint, label: "Staff", href: "/staff", roles: ["OWNER"] },
    { icon: Store, label: "Shops", href: "/shops", roles: ["OWNER", "ADMIN"] },
    { icon: Zap, label: "Requests", href: "/admin/requests", roles: ["ADMIN"] },
    { icon: Crown, label: "Subscription", href: "/subscription", roles: ["OWNER"] },
    { icon: BarChart3, label: "Analytics", href: "/analytics", roles: ["OWNER", "ADMIN"] },
    { icon: Settings, label: "Settings", href: "/settings", roles: ["OWNER", "USER", "ADMIN"] },
  ];

  const filteredNav = navItems.filter(item => {
    if (isOwner && isExpired) {
      return ["/dashboard", "/subscription", "/settings"].includes(item.href);
    }
    return item.roles.includes(userRole);
  });

  if (status === "loading") {
    return (
      <div className="h-screen bg-[#02010a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#00CF64] blur-3xl opacity-20 animate-pulse" />
            <Image src="/w-logo.png" alt="Verve" width={64} height={64} className="relative z-10 animate-bounce" unoptimized priority />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] font-black text-[#00CF64] uppercase tracking-[0.8em] ml-2 animate-pulse">Initializing Neural Link</p>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#00CF64] to-[#10B981] rounded-full animate-loading-bar" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-20 px-6 shrink-0 border-b border-white/[0.04] relative overflow-hidden",
        isCollapsed ? "justify-center" : "gap-4 justify-between"
      )}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00CF64]/5 blur-2xl rounded-full -mr-12 -mt-12" />
        <Link href="/dashboard" className="flex items-center gap-3 group min-w-0 relative z-10">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#00CF64]/20 to-transparent border border-[#00CF64]/20 flex items-center justify-center group-hover:border-[#00CF64]/50 group-hover:scale-105 transition-all p-2 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00CF64] opacity-0 group-hover:opacity-10 transition-opacity" />
            <Image src="/w-logo.png" alt="V" width={24} height={24} className="object-contain relative z-10" unoptimized priority />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden flex flex-col justify-center">
              <p className="text-sm font-black text-white uppercase tracking-tighter font-outfit truncate leading-none mb-1">Billzer</p>
              <p className="text-[7.5px] text-slate-500 font-bold uppercase tracking-[0.3em] truncate leading-none">Nova Technologies</p>
            </div>
          )}
        </Link>

        {/* Desktop collapse btn */}
        {!isCollapsed && (
          <button
            className="hidden lg:flex text-slate-700 hover:text-[#00CF64] transition-all p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Section Label */}
      {!isCollapsed && (
        <div className="px-6 pt-6 pb-2">
          <p className="text-[8.5px] font-black uppercase tracking-[0.4em] text-slate-600">
            {isAdmin ? "Global Core" : "System Access"}
          </p>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 group relative",
                isCollapsed ? "justify-center" : "",
                isActive
                  ? "bg-white text-black shadow-lg scale-[1.02]"
                  : "text-slate-600 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#00CF64] rounded-r-full blur-[2px]" />
              )}
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-all duration-300",
                isActive ? "text-black" : "text-slate-700 group-hover:text-[#00CF64] group-hover:scale-110"
              )} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {/* Tooltip on collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-4 py-2 bg-[#050505] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[90] whitespace-nowrap shadow-3xl pointer-events-none scale-95 group-hover:scale-100">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-6 border-transparent border-r-[#050505]" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Expiry Warning */}
      {isOwner && isExpired && !isCollapsed && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-2xl animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Core Depleted</p>
          </div>
          <p className="text-[9px] text-slate-500 leading-relaxed font-bold">Renew protocols to restore matrix access.</p>
        </div>
      )}

      {/* Bottom: Logout Section */}
      <div className="px-4 pb-6 pt-4 border-t border-white/[0.04] space-y-2">
        {isCollapsed && (
          <button
            className="hidden lg:flex w-full items-center justify-center h-12 rounded-2xl text-slate-700 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "w-full flex items-center gap-4 px-4 h-14 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/10",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#02010a] text-slate-500 antialiased overflow-hidden font-outfit">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] bg-[#050505] border-r border-white/[0.04] flex flex-col transition-all duration-500 shadow-[20px_0_100px_rgba(0,0,0,0.8)]",
        "lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0 w-60" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-[80px]" : "lg:w-60"
      )}>
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00CF64]/5 blur-[150px] -mr-96 -mt-96 pointer-events-none rounded-full opacity-50" />

        {/* TOPBAR */}
        <header className="h-14 shrink-0 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/[0.04] flex items-center gap-4 px-6 md:px-8 relative z-50">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-500 hover:text-white transition-all p-1.5 hover:bg-white/5 rounded-lg border border-white/5"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Institutional Search */}
          <div className="relative flex-1 max-w-lg hidden lg:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-[#00CF64] transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-11 pr-4 h-9 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[12px] text-white placeholder:text-slate-800 outline-none transition-all shadow-inner relative z-10"
            />
          </div>

          <div className="ml-auto flex items-center gap-6">
            {/* Trial Status Protocol */}
            {isOwner && isTrial && !isExpired && planExpiry && (
              <div className="hidden xl:flex items-center gap-4 bg-amber-500/5 border border-amber-500/10 px-5 py-2.5 rounded-[1.2rem] shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                  Trial Mode · {Math.ceil((planExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d Left
                </p>
              </div>
            )}

            {/* Notification Node */}
            <div className="relative group/notif">
              <button className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-700 hover:text-white hover:border-[#00CF64]/30 hover:bg-white/[0.06] transition-all">
                <Bell className="w-4 h-4 group-hover/notif:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#00CF64] rounded-full border border-[#050505] shadow-[0_0_10px_rgba(0,207,100,0.8)]" />
              </button>
              
              {/* Notifications Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#050505] border border-white/10 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/notif:opacity-100 group-hover/notif:translate-y-0 group-hover/notif:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Notifications</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00CF64] animate-pulse" />
                </div>
                <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="p-3 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer group/item">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover/item:text-[#00CF64]">System Online</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Everything is working perfectly</p>
                    </div>
                    <div className="p-3 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer group/item border-t border-white/[0.02]">
                        <p className="text-[10px] font-black text-white uppercase tracking-tight group-hover/item:text-[#00CF64]">Welcome to Billzer</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Your dashboard is ready to use</p>
                    </div>
                </div>
                <div className="p-3 border-t border-white/5 bg-white/[0.01] text-center">
                    <button className="text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Clear All Protocols</button>
                </div>
              </div>
            </div>

            {/* Vertical Splitter */}
            <div className="w-px h-8 bg-white/5 hidden sm:block" />

            {/* Identity Node */}
            <Link href="/settings" className="flex items-center gap-3 cursor-pointer group p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all pr-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00CF64] to-[#10B981] flex items-center justify-center text-black shrink-0 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4 font-bold" />}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">
                  {session?.user?.name || "Neural Operator"}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[8px] text-[#00CF64] font-black uppercase tracking-[0.2em]">
                    {isAdmin ? "Administrator" : isOwner ? (user?.plan || "Owner") : "Staff Member"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Core */}
        <div className="flex-1 overflow-y-auto bg-[#02010a] p-6 md:p-12 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505]/50 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
