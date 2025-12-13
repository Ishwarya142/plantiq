import { Droplets, Sun, Thermometer, Leaf, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

const Recommendation = ({ icon, title, description, reason, priority }: RecommendationProps) => {
  const priorityStyles = {
    high: "border-plant-attention/30 bg-plant-attention/5",
    medium: "border-plant-moderate/30 bg-plant-moderate/5",
    low: "border-plant-healthy/30 bg-plant-healthy/5",
  };

  const priorityBadge = {
    high: "bg-plant-attention/15 text-plant-attention",
    medium: "bg-plant-moderate/15 text-plant-moderate",
    low: "bg-plant-healthy/15 text-plant-healthy",
  };

  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300 cursor-pointer group hover:shadow-soft",
      priorityStyles[priority]
    )}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-background shadow-card">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{title}</h4>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", priorityBadge[priority])}>
              {priority}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mb-2">{description}</p>
          <p className="text-xs text-muted-foreground italic">Why: {reason}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

const CareRecommendations = () => {
  const recommendations = [
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      title: "Water Today",
      description: "Give 200ml of room-temperature water in the morning.",
      reason: "Soil moisture is at 28%, below optimal 40-60% range.",
      priority: "high" as const,
    },
    {
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      title: "Increase Light Exposure",
      description: "Move 30cm closer to the window or add 2 hours of grow light.",
      reason: "Current light levels are 30% below recommended for optimal growth.",
      priority: "medium" as const,
    },
    {
      icon: <Thermometer className="w-5 h-5 text-red-400" />,
      title: "Check Temperature",
      description: "Consider moving away from the window at night.",
      reason: "Nighttime temperatures are dropping below 15°C near windows.",
      priority: "medium" as const,
    },
    {
      icon: <Leaf className="w-5 h-5 text-primary" />,
      title: "Fertilize Next Week",
      description: "Apply balanced liquid fertilizer (10-10-10) diluted to half strength.",
      reason: "It's been 4 weeks since last feeding and growth season is active.",
      priority: "low" as const,
    },
  ];

  return (
    <div className="card-plant p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">Care Recommendations</h3>
        <p className="text-sm text-muted-foreground">Personalized tips for your plant</p>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={index}
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <Recommendation {...rec} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareRecommendations;
