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
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
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
      toast.error("Failed to load staff matrix");
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
        toast.success("Staff node initialized successfully");
        setShowAddModal(false);
        setNewStaff({ name: "", email: "", password: "", role: "STAFF" });
        fetchStaff();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create staff node");
      }
    } catch (error) {
      toast.error("Error connecting to neural link");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm("Terminate this staff node access?")) return;
    
    try {
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Staff node terminated");
        fetchStaff();
      }
    } catch (error) {
      toast.error("Failed to terminate node");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00CF64]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black font-outfit text-white uppercase tracking-tighter">Personnel Control</h1>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">Manage authorized nodes and access protocols</p>
        </div>
        
        <Button 
          onClick={() => setShowAddModal(true)}
          className="h-16 px-8 bg-[#00CF64] hover:bg-[#10B981] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(0,207,100,0.2)] flex gap-3 group"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Initialize New Node
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="bg-[#050505] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group hover:border-[#00CF64]/30 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#00CF64] transition-colors border border-white/5 shadow-inner">
                  <User className="w-8 h-8" />
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                  member.role === "OWNER" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {member.role}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black font-outfit text-white uppercase tracking-tight">{member.name}</h3>
                <div className="flex items-center gap-3 text-slate-500 text-xs font-bold truncate">
                  <Mail className="w-4 h-4 text-slate-700" />
                  {member.email}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Access</span>
                </div>
                {member.role !== "OWNER" && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteStaff(member.id)}
                    className="h-10 w-10 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Staff Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-[#050505] border border-white/10 text-white rounded-[40px] max-w-md p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00CF64]/10 blur-[60px] -mr-20 -mt-20" />
          
          <DialogHeader className="relative z-10 text-center">
            <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter">New Personnel Node</DialogTitle>
            <DialogDescription className="text-slate-500 font-black uppercase text-[10px] tracking-widest mt-2">
              Grant controlled access to the system matrix
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStaff} className="space-y-6 mt-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                <Input 
                  required
                  placeholder="Aryan Sharma" 
                  className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">System Identifier (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                <Input 
                  required
                  type="email"
                  placeholder="aryan@verveledger.com" 
                  className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-4">Security Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#00CF64]" />
                <Input 
                  required
                  type="password"
                  placeholder="••••••••" 
                  className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-16 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all flex items-center justify-center gap-3 mt-4"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authorize Access <Shield className="w-5 h-5" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
