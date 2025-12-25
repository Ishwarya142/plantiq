import { useState, useRef, useEffect } from "react";
import { Search, Leaf, ChevronDown, ChevronUp, X, Droplets, Sun, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  healthScore: number;
  trend: "up" | "down" | "stable";
  environment: {
    temperature: number;
    humidity: number;
    light: number;
    soilMoisture?: number;
  };
}

interface PlantSearchProps {
  plants: Plant[];
  onSelectPlant: (plantId: string) => void;
}

const PlantSearch = ({ plants, onSelectPlant }: PlantSearchProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [expandedPlant, setExpandedPlant] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(query.toLowerCase()) ||
    plant.species.toLowerCase().includes(query.toLowerCase())
  );

  const showResults = isFocused && query.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-plant-healthy bg-plant-healthy/10";
    if (score >= 60) return "text-plant-moderate bg-plant-moderate/10";
    return "text-plant-attention bg-plant-attention/10";
  };

  const toggleExpand = (e: React.MouseEvent, plantId: string) => {
    e.stopPropagation();
    setExpandedPlant(expandedPlant === plantId ? null : plantId);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-lg hidden md:block">
      <div className={cn(
        "relative transition-all duration-300",
        isFocused && "scale-[1.02]"
      )}>
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-300",
          isFocused ? "opacity-100 gradient-primary blur-xl" : "opacity-0"
        )} />
        <div className="relative flex items-center">
          <Search className={cn(
            "absolute left-4 w-4 h-4 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground"
          )} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants, care tips, insights..."
            onFocus={() => setIsFocused(true)}
            className={cn(
              "w-full pl-11 pr-10 py-3 rounded-2xl text-sm transition-all duration-300",
              "bg-muted/50 border border-border/50",
              "placeholder:text-muted-foreground/70",
              "focus:outline-none focus:bg-background focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
            )}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 p-1 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
          {filteredPlants.length === 0 ? (
            <div className="p-6 text-center">
              <Leaf className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-muted-foreground">No plants found for "{query}"</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30">
                {filteredPlants.length} result{filteredPlants.length !== 1 ? "s" : ""} found
              </p>
              {filteredPlants.map((plant) => (
                <div key={plant.id} className="border-b border-border/30 last:border-0">
                  <div
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      onSelectPlant(plant.id);
                      setQuery("");
                      setIsFocused(false);
                    }}
                  >
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{plant.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{plant.species}</p>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-xs font-semibold",
                      getHealthColor(plant.healthScore)
                    )}>
                      {plant.healthScore}%
                    </div>
                    <button
                      onClick={(e) => toggleExpand(e, plant.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      {expandedPlant === plant.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedPlant === plant.id && (
                    <div className="px-4 pb-4 pt-1 bg-muted/20 animate-fade-in">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Temp</p>
                            <p className="text-sm font-medium">{plant.environment.temperature}°C</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Humidity</p>
                            <p className="text-sm font-medium">{plant.environment.humidity}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Light</p>
                            <p className="text-sm font-medium">{plant.environment.light}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          plant.trend === "up" && "bg-plant-healthy/10 text-plant-healthy",
                          plant.trend === "down" && "bg-plant-attention/10 text-plant-attention",
                          plant.trend === "stable" && "bg-muted text-muted-foreground"
                        )}>
                          {plant.trend === "up" && "↑ Improving"}
                          {plant.trend === "down" && "↓ Needs attention"}
                          {plant.trend === "stable" && "→ Stable"}
                        </span>
                        <button
                          onClick={() => {
                            onSelectPlant(plant.id);
                            setQuery("");
                            setIsFocused(false);
                          }}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantSearch;