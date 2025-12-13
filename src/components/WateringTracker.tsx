import { Droplets, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlantWater {
  name: string;
  lastWatered: string;
  nextWater: string;
  daysUntilDry: number;
  moistureLevel: number;
}

const WateringTracker = () => {
  const plants: PlantWater[] = [
    { name: "Living Room Monstera", lastWatered: "2 days ago", nextWater: "Today", daysUntilDry: 0, moistureLevel: 28 },
    { name: "Kitchen Pothos", lastWatered: "1 day ago", nextWater: "Tomorrow", daysUntilDry: 1, moistureLevel: 45 },
    { name: "Office Snake Plant", lastWatered: "5 days ago", nextWater: "In 3 days", daysUntilDry: 3, moistureLevel: 62 },
    { name: "Bedroom Fiddle", lastWatered: "3 days ago", nextWater: "In 2 days", daysUntilDry: 2, moistureLevel: 38 },
  ];

  const getMoistureColor = (level: number) => {
    if (level >= 50) return "bg-plant-healthy";
    if (level >= 30) return "bg-plant-moderate";
    return "bg-plant-attention";
  };

  const getUrgencyStyle = (days: number) => {
    if (days === 0) return "bg-plant-attention/10 border-plant-attention/30 text-plant-attention";
    if (days === 1) return "bg-plant-moderate/10 border-plant-moderate/30 text-plant-moderate";
    return "bg-muted/50 border-border/50 text-muted-foreground";
  };

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-foreground">Watering Tracker</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          Water All Due
        </button>
      </div>

      <div className="space-y-4">
        {plants.map((plant, index) => (
          <div 
            key={plant.name}
            className="animate-fade-in-up opacity-0"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{plant.name}</p>
                <p className="text-xs text-muted-foreground">Last: {plant.lastWatered}</p>
              </div>
              <span className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full border",
                getUrgencyStyle(plant.daysUntilDry)
              )}>
                {plant.nextWater}
              </span>
            </div>
            
            {/* Moisture bar */}
            <div className="relative">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getMoistureColor(plant.moistureLevel)
                  )}
                  style={{ width: `${plant.moistureLevel}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Dry</span>
                <span className="text-xs font-medium text-foreground">{plant.moistureLevel}%</span>
                <span className="text-xs text-muted-foreground">Moist</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick water button */}
      <button className="w-full mt-5 flex items-center justify-center gap-2 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-xl font-medium text-sm transition-colors">
        <Droplets className="w-4 h-4" />
        Log Watering
      </button>
    </div>
  );
};

export default WateringTracker;
