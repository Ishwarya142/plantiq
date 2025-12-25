import { Leaf, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionPlant {
  name: string;
  species: string;
  health: number;
  trend: "up" | "down" | "stable";
  image: string;
}

interface PlantCollectionProps {
  plants: CollectionPlant[];
}

const PlantCollection = ({ plants }: PlantCollectionProps) => {
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-plant-healthy" />;
    if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-plant-attention" />;
    return null;
  };

  const getHealthColor = (health: number) => {
    if (health >= 75) return "text-plant-healthy";
    if (health >= 50) return "text-plant-moderate";
    return "text-plant-attention";
  };

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Collection Overview</h3>
        </div>
        <span className="text-sm text-muted-foreground">{plants.length} plants</span>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Plant</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Species</th>
              <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Health</th>
              <th className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Trend</th>
              <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant, index) => (
              <tr 
                key={plant.name}
                className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={plant.image} 
                      alt={plant.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-sm text-foreground">{plant.name}</span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-sm text-muted-foreground">{plant.species}</span>
                </td>
                <td className="py-3 text-center">
                  <span className={cn("font-semibold text-sm", getHealthColor(plant.health))}>
                    {plant.health}%
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex justify-center">
                    {getTrendIcon(plant.trend)}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantCollection;
