import { Home, TreeDeciduous } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndoorOutdoorToggleProps {
  isOutdoor: boolean;
  onChange: (isOutdoor: boolean) => void;
}

const IndoorOutdoorToggle = ({ isOutdoor, onChange }: IndoorOutdoorToggleProps) => {
  return (
    <div className="glass-card inline-flex items-center p-1.5 gap-1">
      <button
        onClick={() => onChange(false)}
        className={cn(
          "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
          !isOutdoor 
            ? "text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {!isOutdoor && (
          <div className="absolute inset-0 gradient-primary rounded-xl shadow-lg" />
        )}
        <Home className={cn("w-4 h-4 relative z-10", !isOutdoor && "text-white")} />
        <span className="relative z-10">Indoor</span>
      </button>
      <button
        onClick={() => onChange(true)}
        className={cn(
          "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
          isOutdoor 
            ? "text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {isOutdoor && (
          <div className="absolute inset-0 gradient-primary rounded-xl shadow-lg" />
        )}
        <TreeDeciduous className={cn("w-4 h-4 relative z-10", isOutdoor && "text-white")} />
        <span className="relative z-10">Outdoor</span>
      </button>
    </div>
  );
};

export default IndoorOutdoorToggle;
