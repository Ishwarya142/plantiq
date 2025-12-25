import { Leaf } from "lucide-react";
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

  return (
    <div
      onClick={onClick}
      className={cn(
        "card-plant p-4 cursor-pointer group",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2">
          <div className={cn(
            "w-3 h-3 rounded-full pulse-soft",
            getHealthColor()
          )} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground truncate">{name}</h3>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Leaf className="w-3.5 h-3.5" />
          <span className="truncate">{species}</span>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
