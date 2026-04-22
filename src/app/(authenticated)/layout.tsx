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
  Zap
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
    { icon: ShoppingCart, label: "POS Billing", href: "/pos", roles: ["OWNER", "USER"] },
    { icon: Package, label: "Inventory", href: "/inventory", roles: ["OWNER", "USER"] },
    { icon: FileText, label: "Transactions", href: "/invoices", roles: ["OWNER", "USER", "ADMIN"] },
    { icon: Users, label: "Staff", href: "/staff", roles: ["OWNER"] },
    { icon: Store, label: "Shops", href: "/shops", roles: ["OWNER", "ADMIN"] },
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
        <div className="flex flex-col items-center gap-4">
          <Image src="/w-logo.png" alt="Verve" width={48} height={48} className="animate-pulse" unoptimized />
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00CF64] to-[#10B981] rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-[72px] px-4 shrink-0 border-b border-white/[0.06]",
        isCollapsed ? "justify-center" : "gap-3 justify-between"
      )}>
        <Link href="/dashboard" className="flex items-center gap-3 group min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00CF64]/50 transition-all p-1">
            <Image src="/w-logo.png" alt="Verve" width={22} height={22} className="object-contain" unoptimized />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="text-[13px] font-black text-white uppercase tracking-tight font-outfit truncate">Verve Ledger</p>
              <p className="text-[9px] text-[#00CF64]/80 font-bold uppercase tracking-[0.15em] truncate">Verve Nova Technologies</p>
            </div>
          )}
        </Link>
        {/* Mobile close btn */}
        <button className="lg:hidden text-slate-500 hover:text-white p-1" onClick={() => setIsMobileMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
        {/* Desktop collapse btn */}
        {!isCollapsed && (
          <button 
            className="hidden lg:flex text-slate-600 hover:text-white transition-colors p-1"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav Section Label */}
      {!isCollapsed && (
        <p className="px-6 pt-6 pb-2 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
          {isAdmin ? "Admin Panel" : "Navigation"}
        </p>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 group relative",
                isCollapsed ? "justify-center" : "",
                isActive
                  ? "bg-[#00CF64] text-white shadow-[0_4px_24px_rgba(0,207,100,0.3)]"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-all duration-200",
                isActive ? "text-white" : "text-slate-500 group-hover:text-white group-hover:scale-110"
              )} />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {/* Tooltip on collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#111] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[90] whitespace-nowrap shadow-2xl pointer-events-none">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111]" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Expiry Warning */}
      {isOwner && isExpired && !isCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Plan Expired</p>
          </div>
          <p className="text-[9px] text-slate-500 leading-relaxed">Renew to restore full access.</p>
        </div>
      )}

      {/* Bottom: Collapse + Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-white/5 space-y-1">
        {/* Expand btn (only when collapsed on desktop) */}
        {isCollapsed && (
          <button
            className="hidden lg:flex w-full items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all",
            isCollapsed ? "justify-center px-0" : ""
          )}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#02010a] text-slate-400 antialiased overflow-hidden">

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] bg-[#06060a] border-r border-white/[0.06] flex flex-col transition-all duration-300 shadow-[4px_0_30px_rgba(0,0,0,0.4)]",
        // Mobile: slide in/out
        "lg:relative lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0",
        // Desktop: collapsed vs expanded
        isCollapsed ? "lg:w-[72px]" : "lg:w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-16 shrink-0 bg-[#06060a]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center gap-4 px-4 md:px-6">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 h-10 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-slate-600 focus:border-[#00CF64]/40 focus:outline-none transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Trial Badge */}
            {isOwner && isTrial && !isExpired && planExpiry && (
              <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest hidden sm:flex">
                <Zap className="w-3 h-3 mr-1" />
                Trial · {Math.ceil((planExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d left
              </Badge>
            )}

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00CF64] rounded-full" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10 hidden sm:block" />

            {/* User */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[120px]">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-[9px] text-[#00CF64] font-black uppercase tracking-[0.2em] flex items-center justify-end gap-1">
                  {isAdmin && <ShieldCheck className="w-2.5 h-2.5" />}
                  {isAdmin ? "Admin" : isOwner ? (user?.plan || "Owner") : "Staff"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00CF64] to-[#10B981] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-all shadow-lg">
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#02010a] p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
