import { useState, useEffect } from "react";
import { Droplets, Sun, Thermometer, Leaf, ChevronRight, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlantAI, PlantData, CareRecommendation as CareRec, CareRecommendations as CareRecsResponse } from "@/hooks/usePlantAI";

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

const getIconForType = (type: CareRec['type']) => {
  switch (type) {
    case 'watering':
      return <Droplets className="w-5 h-5 text-blue-500" />;
    case 'light':
      return <Sun className="w-5 h-5 text-amber-500" />;
    case 'temperature':
      return <Thermometer className="w-5 h-5 text-red-400" />;
    case 'humidity':
      return <Droplets className="w-5 h-5 text-cyan-500" />;
    case 'fertilizer':
    case 'pruning':
    default:
      return <Leaf className="w-5 h-5 text-primary" />;
  }
};

interface CareRecommendationsProps {
  plantData?: PlantData;
}

const CareRecommendations = ({ plantData }: CareRecommendationsProps) => {
  const { getCareRecommendations, isLoading } = usePlantAI();
  const [recommendations, setRecommendations] = useState<CareRecsResponse | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchRecommendations = async () => {
    if (!plantData) return;
    
    const result = await getCareRecommendations(plantData);
    if (result) {
      setRecommendations(result);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    if (plantData && !hasLoaded) {
      fetchRecommendations();
    }
  }, [plantData]);

  // Fallback recommendations
  const defaultRecommendations = [
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

  const displayRecommendations = recommendations?.recommendations.map(rec => ({
    icon: getIconForType(rec.type),
    title: rec.title,
    description: rec.description,
    reason: rec.reason,
    priority: rec.priority,
  })) || defaultRecommendations;

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Care Recommendations
            {recommendations && <Sparkles className="w-4 h-4 text-primary" />}
          </h3>
          <p className="text-sm text-muted-foreground">
            {recommendations ? 'AI-powered tips for your plant' : 'Personalized tips for your plant'}
          </p>
        </div>
        <button 
          onClick={fetchRecommendations}
          disabled={isLoading || !plantData}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all disabled:opacity-50"
          title="Get AI recommendations"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
      
      {isLoading && !recommendations ? (
        <div className="flex items-center justify-center py-8 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Analyzing plant care needs...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {displayRecommendations.map((rec, index) => (
            <div 
              key={index}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <Recommendation {...rec} />
            </div>
          ))}
        </div>
      )}
      
      {recommendations?.overallAssessment && (
        <div className="mt-4 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
          <strong>AI Assessment:</strong> {recommendations.overallAssessment}
        </div>
      )}
    </div>
  );
};

export default CareRecommendations;
