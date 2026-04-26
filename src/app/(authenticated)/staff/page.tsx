"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  Key, 
  Loader2,
  Lock,
  User,
  Fingerprint,
  Zap,
  Activity,
  ArrowRight,
  Download,
  Plus
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF"
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (res.ok) {
        setStaff(data);
      }
    } catch (error) {
      toast.error("Failed to load personnel matrix");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      if (res.ok) {
        toast.success("Personnel node initialized successfully");
        setShowAddModal(false);
        setNewStaff({ name: "", email: "", password: "", role: "STAFF" });
        fetchStaff();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create personnel node");
      }
    } catch (error) {
      toast.error("Matrix connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm("Terminate this personnel node access?")) return;
    
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Personnel node terminated");
        fetchStaff();
      }
    } catch (error) {
      toast.error("Failed to terminate node");
    }
  };

  if (loading) {
    return (
      <div className="space-y-16 animate-pulse max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="space-y-4">
            <Skeleton className="h-16 w-80 rounded-3xl" />
            <Skeleton className="h-4 w-96 opacity-20" />
          </div>
          <Skeleton className="h-16 w-48 rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-40 max-w-7xl mx-auto px-4">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00CF64]/10 rounded-xl flex items-center justify-center border border-[#00CF64]/20 shadow-xl">
              <Users className="w-5 h-5 text-[#00CF64]" />
            </div>
            <h1 className="text-2xl font-black font-outfit text-white uppercase tracking-tighter">Personnel Hub</h1>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[8px] tracking-[0.4em] ml-14">System Access & Roles</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 bg-white/5 border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger render={
              <Button className="h-11 px-6 bg-[#00CF64] text-white hover:bg-[#10B981] rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl flex gap-2">
                <Plus className="w-4 h-4" /> Add Personnel
              </Button>
            } />
            <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[4rem] max-w-lg p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
              <div className="bg-gradient-to-br from-[#00CF64]/20 to-transparent p-12 text-center relative border-b border-white/5">
                <DialogHeader className="relative z-10 text-center">
                    <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">New Personnel Node</DialogTitle>
                </DialogHeader>
              </div>
              <form onSubmit={handleAddStaff} className="p-12 space-y-8 relative z-10">
                <input required placeholder="Name" className="premium-input w-full pl-6" value={newStaff.name} onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} />
                <input required type="email" placeholder="Email" className="premium-input w-full pl-6" value={newStaff.email} onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} />
                <input required type="password" placeholder="Password" className="premium-input w-full pl-6" value={newStaff.password} onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} />
                <Button type="submit" disabled={submitting} className="w-full h-12 bg-white text-black hover:bg-slate-200 rounded-xl font-black uppercase tracking-widest text-xs">
                  {submitting ? <Loader2 className="animate-spin" /> : "Authorize Access"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="premium-card relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mt-16 group-hover:bg-[#00CF64]/10 transition-all duration-700 blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                    <div className="absolute -inset-1 bg-[#00CF64]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <div className="w-14 h-14 bg-[#050505] rounded-xl flex items-center justify-center text-slate-700 group-hover:text-[#00CF64] group-hover:border-[#00CF64]/40 transition-all border border-white/10 shadow-2xl relative z-10">
                    <Fingerprint className="w-7 h-7" />
                    </div>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  member.role === "OWNER" ? "bg-emerald-500/10 text-[#00CF64] border-emerald-500/20 shadow-lg" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {member.role === "OWNER" ? "Commander" : "Operator"}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black font-outfit text-white uppercase tracking-tight group-hover:text-[#00CF64] transition-colors">{member.name}</h3>
                <div className="flex items-center gap-3 text-slate-500 text-[11px] font-black uppercase tracking-widest truncate bg-white/5 p-3 rounded-xl border border-white/5">
                  <Mail className="w-4 h-4 text-slate-700" />
                  {member.email}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00CF64] animate-pulse shadow-[0_0_10px_rgba(0,207,100,0.8)]" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Link: Active</span>
                </div>
                {member.role !== "OWNER" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteStaff(member.id)}
                    className="h-12 w-12 text-rose-500/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modern Personnel Entry Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[4rem] max-w-lg p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          <div className="bg-gradient-to-br from-[#00CF64]/20 to-transparent p-12 text-center relative border-b border-white/5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00CF64]/10 blur-[80px] -mr-20 -mt-20" />
            
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 mb-6 shadow-2xl">
                <UserPlus className="w-10 h-10 text-[#00CF64]" />
            </div>
            <DialogHeader className="relative z-10 text-center">
                <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">New Personnel Node</DialogTitle>
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] mt-3">Grant authorized matrix access</p>
            </DialogHeader>
          </div>

          <form onSubmit={handleAddStaff} className="p-12 space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Personnel Identity</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-[#00CF64] transition-colors" />
                <input 
                  required
                  placeholder="e.g. Aryan Sharma" 
                  className="premium-input w-full pl-16"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">System Identifier (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-[#00CF64] transition-colors" />
                <input 
                  required
                  type="email"
                  placeholder="name@matrix.core" 
                  className="premium-input w-full pl-16"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Security Protocol (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-[#00CF64] transition-colors" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••" 
                  className="premium-input w-full pl-16 font-black"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-20 bg-white text-black hover:bg-slate-200 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all flex items-center justify-center gap-4 mt-4 active:scale-95"
            >
              {submitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <>Authorize Access <Shield className="w-6 h-6" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Floating Network Insight */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
          <div className="glass-dark rounded-[3rem] p-6 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto flex items-center justify-between px-12">
              <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20"><Activity className="w-6 h-6" /></div>
                  <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Network Synchronization</p>
                      <p className="text-xl font-black text-white font-outfit tracking-tighter">ENCRYPTED</p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                  <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Authorized Nodes</p>
                      <p className="text-xl font-black text-white font-outfit tracking-tighter">{staff.length}</p>
                  </div>
                  <Button variant="ghost" className="h-12 px-6 bg-white/5 text-slate-500 hover:text-[#00CF64] rounded-2xl font-black uppercase tracking-widest text-[9px]">Log Archive</Button>
              </div>
          </div>
      </div>
    </div>
  );
}
