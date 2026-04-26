"use client";

import { useState } from "react";
import { Check, Zap, Crown, ShieldCheck, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { RazorpayScript } from "@/components/payments/RazorpayScript";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

const plans = [
  {
    name: "Monthly Pro",
    id: "MONTHLY",
    price: "₹999",
    duration: "Per Month",
    features: ["Unlimited Invoices", "Advanced Inventory", "5 Staff Members", "Priority Support", "AI Analytics"],
    color: "emerald",
    icon: Zap,
    popular: false,
  },
  {
    name: "Yearly Elite",
    id: "YEARLY",
    price: "₹4,999",
    duration: "Per Year",
    features: ["Everything in Pro", "Unlimited Staff", "Dedicated Support", "Custom Branding", "Bulk Import/Export"],
    color: "indigo",
    icon: Crown,
    popular: true,
  },
];


export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customData, setCustomData] = useState({
    message: "",
    phone: ""
  });

  const handleSubscribe = async (planId: string) => {
    if (planId === "FREE") {
      toast.info("You are already on the Starter plan.");
      return;
    }
    
    setLoading(planId);
    
    try {
      const plan = plans.find(p => p.id === planId);
      const amount = planId === "MONTHLY" ? 999 : 4999;

      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount,
          planId,
          shopId: (session?.user as any)?.shopId
        }),
      });

      const order = await res.json();

      if (!res.ok) throw new Error(order.error || "Failed to create order");

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Billzer",
        description: `${plan?.name} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          toast.success("Payment Successful! Activating your plan...");
          // We could also call a verification API here, but Webhook is safer.
          // For immediate UI update, we can refresh the page or session.
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#00CF64",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("CUSTOM");
    
    try {
      const res = await fetch("/api/plan-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: customData.message,
          phone: customData.phone,
          planType: "CUSTOM_REQUEST"
        })
      });
      
      if (res.ok) {
        toast.success("Custom request submitted successfully!");
        setShowCustomModal(false);
      } else {
        toast.error("Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <RazorpayScript />
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <h2 className="text-xl font-black font-outfit text-white tracking-tighter uppercase">Subscription Plans</h2>
        <p className="text-slate-500 font-bold uppercase text-[7px] tracking-widest">
          Choose your business protocol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={cn(
            "premium-card relative overflow-hidden group bg-[#050505] border-white/5 rounded-[2.5rem] transition-all duration-500",
            plan.popular ? "border-[#00CF64]/40 shadow-[0_0_50px_rgba(0,207,100,0.1)]" : "hover:border-white/20"
          )}>
            {plan.popular && (
              <div className="absolute top-8 right-8 z-20">
                <div className="bg-[#00CF64] text-black font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 rounded-full shadow-2xl">
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00CF64]/10 blur-[80px] -mr-16 -mt-16 transition-all duration-700 opacity-0 group-hover:opacity-100" />
            
            <CardHeader className="p-10 pb-6 relative z-10">
                <p className="text-[10px] font-black text-[#00CF64] uppercase tracking-[0.4em] mb-4">{plan.name}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-outfit tracking-tighter">₹{plan.price}</span>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">/ lifecycle</span>
                </div>
            </CardHeader>
            
            <CardContent className="p-10 pt-0 space-y-8 relative z-10">
                <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 group/item">
                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00CF64] group-hover/item:bg-[#00CF64] group-hover/item:text-black transition-all">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-white transition-colors">{feature}</span>
                        </div>
                    ))}
                </div>

                <Button 
                    className={cn(
                        "w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all",
                        (session?.user as any)?.planId === plan.id ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed" : "bg-[#00CF64] text-white hover:bg-[#10B981] hover:scale-[1.02] active:scale-95"
                    )}
                    disabled={(session?.user as any)?.planId === plan.id || loading === plan.id}
                    onClick={() => handleSubscribe(plan.id)}
                >
                    {(session?.user as any)?.planId === plan.id ? "Active Protocol" : (loading === plan.id ? <Loader2 className="animate-spin" /> : "Request Authorization")}
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-[48px] p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] -mr-64 -mt-64" />
        
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Custom Intelligence</h3>
          </div>
          <p className="text-slate-500 max-w-xl font-black uppercase text-[10px] tracking-widest leading-loose">
            Need a tailored solution? Custom staff limits, dedicated hardware integration, or multi-location synchronization? Contact our Lead Architects for a bespoke plan.
          </p>
        </div>

        <Button 
          onClick={() => setShowCustomModal(true)}
          className="bg-white text-black hover:bg-slate-200 h-16 px-10 rounded-[24px] font-black uppercase tracking-widest text-[11px] relative z-10 group shadow-2xl"
        >
          Customize My Matrix
          <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>

      {/* Custom Request Modal */}
      <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
        <DialogContent className="bg-[#050505] border-white/5 text-white max-w-lg rounded-[32px] p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-outfit uppercase tracking-tighter">Bespoke Configuration</DialogTitle>
            <DialogDescription className="text-slate-500 font-black uppercase text-[9px] tracking-widest mt-2">
              Submit your requirements to the Lead Architect.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCustomRequest} className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Phone Number</label>
              <Input 
                required
                placeholder="+91 XXXXX XXXXX" 
                className="h-14 bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-slate-700"
                value={customData.phone}
                onChange={(e) => setCustomData({...customData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Requirements</label>
              <Textarea 
                required
                placeholder="Describe your enterprise requirements..." 
                className="min-h-[120px] bg-white/5 border-white/5 rounded-2xl text-white placeholder:text-slate-700 p-4"
                value={customData.message}
                onChange={(e) => setCustomData({...customData, message: e.target.value})}
              />
            </div>
            
            <DialogFooter className="mt-8">
              <Button 
                type="submit"
                disabled={!!loading}
                className="w-full h-14 bg-[#00CF64] hover:bg-[#10B981] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-[0_0_20px_rgba(0,207,100,0.2)]"
              >
                {loading === "CUSTOM" ? "Transmitting..." : "Initialize Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
