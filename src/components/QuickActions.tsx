import { Droplets, Camera, Plus, Calendar, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Action {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}

const QuickActions = () => {
  const actions: Action[] = [
    { 
      icon: <Droplets className="w-5 h-5" />, 
      label: "Water", 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    { 
      icon: <Camera className="w-5 h-5" />, 
      label: "Scan", 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    { 
      icon: <Plus className="w-5 h-5" />, 
      label: "Add Plant", 
      color: "text-plant-healthy",
      bgColor: "bg-plant-healthy/10 hover:bg-plant-healthy/20"
    },
    { 
      icon: <Calendar className="w-5 h-5" />, 
      label: "Schedule", 
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 hover:bg-amber-500/20"
    },
    { 
      icon: <BookOpen className="w-5 h-5" />, 
      label: "Journal", 
      color: "text-rose-500",
      bgColor: "bg-rose-500/10 hover:bg-rose-500/20"
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: "Settings", 
      color: "text-muted-foreground",
      bgColor: "bg-muted/50 hover:bg-muted"
    },
  ];

  return (
    <div className="card-plant p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
              action.bgColor,
              action.color,
              "animate-fade-in-up opacity-0"
            )}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            {action.icon}
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
