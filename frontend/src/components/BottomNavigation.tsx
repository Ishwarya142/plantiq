import { useState } from "react";
import { Home, Leaf, Calendar, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "plants", icon: Leaf, label: "Plants" },
  { id: "schedule", icon: Calendar, label: "Schedule" },
  { id: "alerts", icon: Bell, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation = ({ activeTab = "home", onTabChange }: BottomNavigationProps) => {
  const [active, setActive] = useState(activeTab);
  const [ripple, setRipple] = useState<string | null>(null);

  const handleTabClick = (id: string) => {
    setActive(id);
    setRipple(id);
    onTabChange?.(id);
    setTimeout(() => setRipple(null), 500);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-t border-border/50" />
      
      {/* Safe area padding for notch devices */}
      <div className="relative px-2 pt-2 pb-safe">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300",
                  isActive && "bg-primary/10"
                )}
              >
                {/* Ripple effect */}
                {ripple === item.id && (
                  <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" />
                )}
                
                {/* Active indicator */}
                <div className={cn(
                  "absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300",
                  isActive ? "bg-primary scale-100" : "scale-0"
                )} />
                
                {/* Icon container with animation */}
                <div className={cn(
                  "relative transition-all duration-300",
                  isActive && "transform -translate-y-0.5 scale-110"
                )}>
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-colors duration-300",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  
                  {/* Glow effect when active */}
                  {isActive && (
                    <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-[10px] font-medium transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
