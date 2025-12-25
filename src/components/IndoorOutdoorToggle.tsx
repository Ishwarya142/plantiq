import { Home, TreeDeciduous } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndoorOutdoorToggleProps {
  isOutdoor: boolean;
  onChange: (isOutdoor: boolean) => void;
}

const IndoorOutdoorToggle = ({ isOutdoor, onChange }: IndoorOutdoorToggleProps) => {
  return (
    <div className="inline-flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
      <button
        onClick={() => onChange(false)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          !isOutdoor 
            ? "bg-background text-foreground shadow-card" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className="w-4 h-4" />
        <span>Indoor</span>
      </button>
      <button
        onClick={() => onChange(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          isOutdoor 
            ? "bg-background text-foreground shadow-card" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <TreeDeciduous className="w-4 h-4" />
        <span>Outdoor</span>
      </button>
    </div>
  );
};

export default IndoorOutdoorToggle;
