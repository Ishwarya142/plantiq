import { Link } from "react-router-dom";
import { 
  ArrowLeft, Crown, Check, Sparkles, Leaf, Zap, Shield, 
  BarChart3, Bell, Cloud, Infinity 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const features = [
  {
    icon: Leaf,
    title: "Unlimited Plants",
    description: "Track as many plants as you want",
    free: "Up to 5 plants",
    pro: "Unlimited",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Advanced AI-powered care recommendations",
    free: "Basic tips",
    pro: "Advanced AI analysis",
  },
  {
    icon: BarChart3,
    title: "Growth Analytics",
    description: "Detailed growth tracking and predictions",
    free: "7-day history",
    pro: "Unlimited history",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Personalized care reminders",
    free: "Basic reminders",
    pro: "Smart scheduling",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    description: "Access your plants from any device",
    free: "Local only",
    pro: "Full cloud sync",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get help when you need it",
    free: "Community support",
    pro: "24/7 priority support",
  },
];

const Pro = () => {
  const handleUpgrade = (plan: string) => {
    toast.success(`Starting ${plan} subscription... (Demo)`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      <div className="fixed top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">Upgrade to Pro</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-4">
            <Crown className="w-4 h-4" />
            PlantIQ Pro
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Your Plant's
            <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Full Potential
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Get advanced AI insights, unlimited plant tracking, and premium features to become the ultimate plant parent.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Monthly */}
          <div className="bento-card p-6 relative overflow-hidden">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Monthly</h3>
              <p className="text-sm text-muted-foreground">Perfect for getting started</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$4.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              {["Unlimited plants", "AI insights", "Cloud sync", "Priority support"].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-plant-healthy" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("monthly")}
              className="w-full py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
            >
              Start Monthly
            </button>
          </div>

          {/* Yearly */}
          <div className="bento-card p-6 relative overflow-hidden border-amber-500/50">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
              BEST VALUE
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Yearly</h3>
              <p className="text-sm text-muted-foreground">Save 40% with annual billing</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">$35.99</span>
              <span className="text-muted-foreground">/year</span>
              <p className="text-sm text-plant-healthy mt-1">That's just $2.99/month!</p>
            </div>
            <ul className="space-y-3 mb-6">
              {["Everything in Monthly", "2 months free", "Early access to features", "Exclusive plant guides"].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-amber-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade("yearly")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Start Yearly - Save 40%
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bento-card p-6 mb-12">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">Feature Comparison</h3>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={cn(
                  "grid grid-cols-3 gap-4 py-4",
                  index !== features.length - 1 && "border-b border-border/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{feature.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">{feature.free}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm text-amber-500 font-medium">{feature.pro}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
            <div />
            <div className="text-center">
              <span className="text-xs font-medium text-muted-foreground uppercase">Free</span>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-amber-500 uppercase flex items-center justify-center gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Have questions?{" "}
            <button className="text-primary hover:underline">Contact our support team</button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Pro;