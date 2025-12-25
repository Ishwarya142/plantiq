import { cn } from "@/lib/utils";

interface PlantHealthScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const PlantHealthScore = ({ score, size = "md" }: PlantHealthScoreProps) => {
  const getStatus = () => {
    if (score >= 75) return { label: "Healthy", colorClass: "text-plant-healthy" };
    if (score >= 50) return { label: "Moderate Stress", colorClass: "text-plant-moderate" };
    return { label: "Needs Attention", colorClass: "text-plant-attention" };
  };

  const status = getStatus();
  
  const sizeClasses = {
    sm: { circle: "w-20 h-20", text: "text-xl", label: "text-xs" },
    md: { circle: "w-32 h-32", text: "text-3xl", label: "text-sm" },
    lg: { circle: "w-40 h-40", text: "text-4xl", label: "text-base" },
  };

  const radius = size === "sm" ? 32 : size === "md" ? 52 : 65;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const getStrokeColor = () => {
    if (score >= 75) return "hsl(var(--plant-healthy))";
    if (score >= 50) return "hsl(var(--plant-moderate))";
    return "hsl(var(--plant-attention))";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size].circle)}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${(radius + 8) * 2} ${(radius + 8) * 2}`}>
          {/* Background circle */}
          <circle
            cx={radius + 8}
            cy={radius + 8}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
            className="opacity-40"
          />
          {/* Progress circle */}
          <circle
            cx={radius + 8}
            cy={radius + 8}
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", status.colorClass, sizeClasses[size].text)}>
            {score}
          </span>
          <span className="text-muted-foreground text-xs">/ 100</span>
        </div>
      </div>
      <div className={cn(
        "px-3 py-1 rounded-full font-semibold",
        sizeClasses[size].label,
        score >= 75 ? "bg-plant-healthy/15 text-plant-healthy" :
        score >= 50 ? "bg-plant-moderate/15 text-plant-moderate" :
        "bg-plant-attention/15 text-plant-attention"
      )}>
        {status.label}
      </div>
    </div>
  );
};

export default PlantHealthScore;
