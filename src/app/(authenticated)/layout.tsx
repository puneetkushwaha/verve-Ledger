"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  X
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const user = session?.user as any;
  const userRole = user?.role || "USER";
  const isAdmin = userRole === "ADMIN";
  const isOwner = userRole === "OWNER";

  // Check for Plan Expiry
  const planExpiry = user?.planExpiry ? new Date(user.planExpiry) : null;
  const isExpired = planExpiry && planExpiry < new Date();
  const isTrial = user?.plan === "TRIAL";

  useEffect(() => {
    // Close mobile menu on path change
    setIsMobileMenuOpen(false);

    if (status === "authenticated" && isOwner && isExpired && pathname !== "/subscription") {
      router.push("/subscription");
    }
  }, [status, isOwner, isExpired, pathname, router]);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["OWNER", "USER", "ADMIN"] },
    { icon: ShoppingCart, label: "POS Billing", href: "/pos", roles: ["OWNER", "USER"] },
    { icon: Package, label: "Inventory", href: "/inventory", roles: ["OWNER", "USER"] },
    { icon: Users, label: "Staff", href: "/staff", roles: ["OWNER"] },
    { icon: FileText, label: "Transactions", href: "/invoices", roles: ["OWNER", "USER", "ADMIN"] },
    { icon: Store, label: "Manage Shops", href: "/shops", roles: ["OWNER", "ADMIN"] },
    { icon: Crown, label: "Subscription", href: "/subscription", roles: ["OWNER"] },
    { icon: BarChart3, label: "AI Analytics", href: "/analytics", roles: ["OWNER", "ADMIN"] },
    { icon: Settings, label: "Settings", href: "/settings", roles: ["OWNER", "USER", "ADMIN"] },
  ];

  const filteredSidebar = sidebarItems.filter(item => {
    if (isOwner && isExpired) {
      return item.href === "/dashboard" || item.href === "/subscription" || item.href === "/settings";
    }
    return item.roles.includes(userRole);
  });

  if (status === "loading") {
    return <div className="h-screen bg-[#02010a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CF64]"></div>
    </div>;
  }

  return (
    <div className="flex h-screen bg-[#02010a] text-slate-400 font-inter antialiased overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 bg-[#050505] border-r border-white/5 flex flex-col z-[70] transition-all duration-300 lg:relative lg:translate-x-0 shadow-2xl",
        isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
        isSidebarCollapsed ? "lg:w-24" : "lg:w-72"
      )}>
        <div className={cn("p-8 flex items-center h-28 shrink-0", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/dashboard" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#00CF64] to-[#10B981] rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all">
              <Package className="w-6 h-6" />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-black font-outfit tracking-tighter text-white uppercase hidden lg:block whitespace-nowrap">
                Verve Ledger
              </span>
            )}
            <span className="text-xl font-black font-outfit tracking-tighter text-white uppercase lg:hidden whitespace-nowrap">
              Verve Ledger
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {!isSidebarCollapsed && (
             <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 hidden lg:block">
               {isAdmin ? "Admin Intelligence" : "Core Systems"}
             </p>
          )}
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 lg:hidden">
             {isAdmin ? "Admin Intelligence" : "Core Systems"}
          </p>

          {filteredSidebar.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all group relative",
                isSidebarCollapsed ? "justify-center p-4 lg:p-4" : "gap-4 px-5 py-4 lg:gap-4 lg:px-5 lg:py-4",
                "gap-4 px-5 py-4", // reset for mobile
                isSidebarCollapsed && "lg:justify-center lg:px-0 lg:py-4", // apply collapse to desktop
                pathname === item.href 
                  ? "bg-[#00CF64] text-white shadow-[0_0_20px_rgba(0,207,100,0.3)]" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                pathname === item.href ? "text-white" : "text-slate-600 group-hover:text-white"
              )} />
              <span className={cn(
                "hidden lg:block whitespace-nowrap",
                isSidebarCollapsed ? "lg:hidden" : ""
              )}>
                {item.label}
              </span>
              <span className="lg:hidden whitespace-nowrap">
                {item.label}
              </span>

              {/* Tooltip for collapsed sidebar */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[80] whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {isOwner && isExpired && !isSidebarCollapsed && (
          <div className="m-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3 hidden lg:block">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Access Suspended</p>
            <p className="text-[9px] text-slate-500 leading-tight">Your trial/plan has expired. Please renew to unlock billing.</p>
          </div>
        )}
        {isOwner && isExpired && (
          <div className="m-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-3 lg:hidden">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto" />
            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Access Suspended</p>
            <p className="text-[9px] text-slate-500 leading-tight">Your trial/plan has expired. Please renew to unlock billing.</p>
          </div>
        )}

        <div className="p-4 mt-auto border-t border-white/5 bg-[#080808] space-y-2">
          <Button 
            variant="ghost"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              "hidden lg:flex w-full items-center text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl font-black uppercase tracking-widest transition-all group",
              isSidebarCollapsed ? "justify-center p-4" : "justify-start gap-4 px-5 py-4"
            )}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5 shrink-0 group-hover:text-[#00CF64] transition-colors" /> : <ChevronLeft className="w-5 h-5 shrink-0 group-hover:text-[#00CF64] transition-colors" />}
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Minimize Matrix</span>}
          </Button>

          <Button 
            variant="ghost" 
            className={cn(
              "w-full flex items-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl font-black uppercase tracking-widest transition-all",
              isSidebarCollapsed ? "lg:justify-center lg:p-4" : "lg:justify-start lg:gap-4 lg:px-5 lg:py-4",
              "justify-start gap-4 px-5 py-4" // mobile default
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={cn(
              "hidden lg:block whitespace-nowrap",
              isSidebarCollapsed ? "lg:hidden" : ""
            )}>Deactivate</span>
            <span className="lg:hidden whitespace-nowrap">Deactivate</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Topbar */}
        <header className="h-20 shrink-0 bg-[#02010a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-10 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-white hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>

            <div className="relative w-full max-w-xl group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-[#00CF64] transition-colors" />
              <input 
                type="text" 
                placeholder={isAdmin ? "System Global Query..." : "Query Matrix: Inventory, Sales..."}
                className="w-full pl-12 pr-6 h-12 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder:text-slate-600 focus:border-[#00CF64]/50 focus:ring-0 transition-all outline-none"
              />
            </div>
            
            {isOwner && isTrial && !isExpired && (
              <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 md:px-4 md:py-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest animate-pulse whitespace-nowrap">
                Trial Active: {Math.ceil((planExpiry!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 md:gap-8 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-white hover:bg-white/5 rounded-xl h-11 w-11 transition-all">
                <Bell className="w-6 h-6" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#00CF64] rounded-full border-2 border-[#02010a] animate-pulse"></span>
              </Button>
            </div>
            <div className="h-8 w-px bg-white/5 hidden sm:block"></div>
            <div className="flex items-center gap-3 md:gap-5 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white font-outfit uppercase tracking-tighter">
                  {session?.user?.name || "Initializing..."}
                </p>
                <p className="text-[10px] text-[#00CF64] font-black uppercase tracking-[0.3em] flex items-center justify-end gap-1">
                  {isAdmin && <ShieldCheck className="w-3 h-3" />}
                  {isAdmin ? "Admin" : user?.plan === "TRIAL" ? "Trial" : "Premium"}
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#00CF64] to-[#10B981] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-all shrink-0">
                {isAdmin ? <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" /> : <User className="w-6 h-6 md:w-7 md:h-7" />}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#02010a] relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
