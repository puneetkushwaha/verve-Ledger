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
        name: "Verve Ledger",
        description: `${plan?.name} Subscription`,
        order_id: order.id,
        handler: async function (response: any) {
          toast.success("Payment Successful! Activating your plan...");
          // We could also call a verification API here, but Webhook is safer.
          // For immediate UI update, we can refresh the page or session.
          setTimeout(() => {
            window.location.reload();
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
      const res = await fetch("/api/subscription/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customData,
          shopId: (session?.user as any)?.shopId,
          shopName: session?.user?.name,
          email: session?.user?.email
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
    <div className="space-y-12 pb-20">
      <RazorpayScript />
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl font-black font-outfit text-white tracking-tighter uppercase">Elevate Your Matrix</h2>
        <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">
          Scale your business with institutional-grade intelligence and unlimited operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`bg-[#050505] border-white/5 rounded-[40px] overflow-hidden relative group transition-all duration-500 hover:border-[#00CF64]/30 ${plan.popular ? 'border-[#00CF64]/50' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-6 right-6">
                <Badge className="bg-[#00CF64] text-white font-black uppercase tracking-widest text-[9px] px-3 py-1">Most Popular</Badge>
              </div>
            )}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full -mr-32 -mt-32 opacity-10 group-hover:opacity-20 transition-opacity bg-${plan.color}-500`} />
            
            <CardHeader className="p-10 pb-0 relative z-10">
              <div className={`w-14 h-14 rounded-2xl bg-${plan.color}-500/10 flex items-center justify-center text-${plan.color}-400 mb-6 border border-white/5`}>
                <plan.icon className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-black font-outfit text-white uppercase tracking-tight">{plan.name}</CardTitle>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white font-outfit tracking-tighter">{plan.price}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{plan.duration}</span>
              </div>
            </CardHeader>

            <CardContent className="p-10 space-y-6 relative z-10">
              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00CF64]/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#00CF64]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-10 pt-0 relative z-10">
              <Button 
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!loading}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                  plan.popular 
                    ? 'bg-[#00CF64] hover:bg-[#10B981] text-white shadow-[0_0_30px_rgba(0,207,100,0.2)]' 
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {loading === plan.id ? "Initializing..." : "Activate Now"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Custom Plan / Contact Admin Section */}
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
