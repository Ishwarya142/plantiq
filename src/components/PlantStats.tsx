import { TrendingUp, TrendingDown, Minus, Leaf, Droplets, Sun, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const PlantStats = () => {
  const stats: Stat[] = [
    {
      label: "Total Plants",
      value: "12",
      change: 2,
      icon: <Leaf className="w-5 h-5" />,
      color: "text-primary",
    },
    {
      label: "Avg Health",
      value: "82%",
      change: 5,
      icon: <Activity className="w-5 h-5" />,
      color: "text-plant-healthy",
    },
    {
      label: "Water This Week",
      value: "18L",
      change: -3,
      icon: <Droplets className="w-5 h-5" />,
      color: "text-blue-500",
    },
    {
      label: "Light Hours",
      value: "6.2h",
      change: 0.5,
      icon: <Sun className="w-5 h-5" />,
      color: "text-amber-500",
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card-plant p-5 animate-fade-in-up opacity-0"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn("p-2.5 rounded-xl bg-muted/50", stat.color)}>
              {stat.icon}
            </div>
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              getTrendColor(stat.change)
            )}>
              {getTrendIcon(stat.change)}
              <span>{Math.abs(stat.change)}{stat.label.includes("%") || stat.label.includes("h") ? "" : ""}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default PlantStats;
