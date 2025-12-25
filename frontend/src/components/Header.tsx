import { Leaf, Bell, Menu, Sparkles, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { Link } from "react-router-dom";
import AccountPopover from "@/components/AccountPopover";
import PlantSearch from "@/components/PlantSearch";

import monsteraImg from "@/assets/monstera.jpg";
import fiddleLeafImg from "@/assets/fiddle-leaf.jpg";
import snakePlantImg from "@/assets/snake-plant.jpg";
import pothosImg from "@/assets/pothos.jpg";

interface HeaderProps {
  alertCount?: number;
  onSelectPlant?: (plantId: string) => void;
}

const searchPlants = [
  {
    id: "1",
    name: "Living Room Monstera",
    species: "Monstera Deliciosa",
    image: monsteraImg,
    healthScore: 87,
    trend: "up" as const,
    environment: { temperature: 22, humidity: 55, light: 65, soilMoisture: 45 },
  },
  {
    id: "2",
    name: "Bedroom Fiddle",
    species: "Ficus Lyrata",
    image: fiddleLeafImg,
    healthScore: 62,
    trend: "down" as const,
    environment: { temperature: 20, humidity: 42, light: 48, soilMoisture: 28 },
  },
  {
    id: "3",
    name: "Office Snake Plant",
    species: "Sansevieria",
    image: snakePlantImg,
    healthScore: 94,
    trend: "stable" as const,
    environment: { temperature: 23, humidity: 35, light: 40, soilMoisture: 55 },
  },
  {
    id: "4",
    name: "Kitchen Pothos",
    species: "Epipremnum Aureum",
    image: pothosImg,
    healthScore: 78,
    trend: "up" as const,
    environment: { temperature: 24, humidity: 60, light: 70, soilMoisture: 52 },
  },
];

const Header = ({ alertCount = 3, onSelectPlant }: HeaderProps) => {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSelectPlant = (plantId: string) => {
    if (onSelectPlant) {
      onSelectPlant(plantId);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl border-b border-border/50" />
      
      <div className="container relative mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative gradient-primary p-2.5 rounded-2xl shadow-lg">
                <Leaf className="w-6 h-6 text-white float" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                PlantIQ
              </h1>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-Powered Plant Care
              </p>
            </div>
          </Link>

          {/* Search */}
          <PlantSearch plants={searchPlants} onSelectPlant={handleSelectPlant} />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="icon-btn group relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun className={cn(
                  "w-5 h-5 absolute inset-0 transition-all duration-500 text-amber-500",
                  resolvedTheme === "dark" 
                    ? "rotate-0 scale-100 opacity-100" 
                    : "-rotate-90 scale-0 opacity-0"
                )} />
                <Moon className={cn(
                  "w-5 h-5 absolute inset-0 transition-all duration-500 text-indigo-500",
                  resolvedTheme === "dark" 
                    ? "rotate-90 scale-0 opacity-0" 
                    : "rotate-0 scale-100 opacity-100"
                )} />
              </div>
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="icon-btn relative group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 gradient-warm text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {alertCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <AccountPopover />

            {/* Mobile menu */}
            <button className="icon-btn lg:hidden">
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
