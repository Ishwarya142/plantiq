import { TrendingUp, TrendingDown, Minus, Leaf, Droplets, Sun, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const PlantStats = () => {
  const stats: Stat[] = [
    {
      label: "Total Plants",
      value: "12",
      change: 2,
      icon: <Leaf className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Avg Health",
      value: "82%",
      change: 5,
      icon: <Activity className="w-5 h-5" />,
      color: "text-plant-healthy",
      bgColor: "bg-plant-healthy/10",
    },
    {
      label: "Water This Week",
      value: "18L",
      change: -3,
      icon: <Droplets className="w-5 h-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Light Hours",
      value: "6.2h",
      change: 0.5,
      icon: <Sun className="w-5 h-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3.5 h-3.5" />;
    if (change < 0) return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-plant-healthy bg-plant-healthy/10";
    if (change < 0) return "text-plant-attention bg-plant-attention/10";
    return "text-muted-foreground bg-muted";
  };

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Weekly Overview</h3>
          <p className="text-sm text-muted-foreground">Your plant care summary</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'forwards' }}
          >
            {/* Glow effect on hover */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10",
              stat.bgColor
            )} />

            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300", stat.bgColor, stat.color)}>
                {stat.icon}
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getTrendColor(stat.change)
              )}>
                {getTrendIcon(stat.change)}
                <span>{stat.change > 0 ? "+" : ""}{stat.change}</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantStats;
