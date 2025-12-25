import { Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantCardProps {
  name: string;
  species: string;
  image: string;
  healthScore: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const PlantCard = ({ name, species, image, healthScore, isSelected, onClick }: PlantCardProps) => {
  const getHealthColor = () => {
    if (healthScore >= 75) return "bg-plant-healthy";
    if (healthScore >= 50) return "bg-plant-moderate";
    return "bg-plant-attention";
  };

  const getHealthLabel = () => {
    if (healthScore >= 75) return "Healthy";
    if (healthScore >= 50) return "Fair";
    return "Needs Care";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-3 cursor-pointer group relative overflow-hidden transition-all duration-500",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20"
      )}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
      )}

      <div className="relative overflow-hidden rounded-2xl aspect-square mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        {/* Health indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md">
          <div className={cn(
            "w-2 h-2 rounded-full pulse-soft",
            getHealthColor()
          )} />
          <span className="text-[10px] font-medium text-white">{healthScore}%</span>
        </div>

        {/* Hover content */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium text-white",
            healthScore >= 75 ? "bg-plant-healthy/80" : healthScore >= 50 ? "bg-plant-moderate/80" : "bg-plant-attention/80"
          )}>
            {healthScore >= 75 ? <TrendingUp className="w-3 h-3" /> : healthScore >= 50 ? null : <TrendingDown className="w-3 h-3" />}
            {getHealthLabel()}
          </span>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h3 className="font-semibold text-foreground truncate text-sm group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Leaf className="w-3 h-3 text-primary/60" />
          <span className="truncate">{species}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
