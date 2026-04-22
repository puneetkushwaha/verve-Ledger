import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Target,
  LineChart,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AIInsights() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <BrainCircuit className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">AI Intelligence</h2>
            <p className="text-slate-500 mt-1">Predictive analytics and smart inventory optimization.</p>
          </div>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Generate Full Report
        </Button>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-[#00CF64] to-[#10B981] text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Revenue Prediction
            </CardTitle>
            <CardDescription className="text-emerald-100">Expected sales for May 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold">₹4,85,000</h3>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded flex items-center gap-1">
                <ArrowUp className="w-3 h-3" /> 18%
              </span>
            </div>
            <p className="text-sm text-emerald-100 mt-4">Based on seasonal trends and past 3 years of data.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <AlertTriangle className="w-5 h-5" /> Stock Risk Alert
            </CardTitle>
            <CardDescription>Slow moving items identified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium">Mechanical Keyboards</span>
              <span className="text-xs text-emerald-700 font-bold">90+ days idle</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium">USB-C Hubs (Grey)</span>
              <span className="text-xs text-emerald-700 font-bold">65 days idle</span>
            </div>
            <p className="text-xs text-slate-400">AI Recommendation: Launch a 15% discount bundle.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-[#00CF64]">
              <Zap className="w-5 h-5" /> Best Selling Logic
            </CardTitle>
            <CardDescription>Next 30 days forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Wireless Mouse</span>
                  <span>92% Probability</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00CF64] h-full w-[92%]"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Monitor Stands</span>
                  <span>78% Probability</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00CF64] h-full w-[78%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-500" /> Customer Behavior Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg m-4 mt-0 text-slate-400">
            Interactive Behavior Map Placeholder
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-emerald-500" /> Profitability Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg m-4 mt-0 text-slate-400">
            Advanced Profitability Chart Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
