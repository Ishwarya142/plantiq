import { Leaf, Bell, Settings, Search } from "lucide-react";

interface HeaderProps {
  alertCount?: number;
}

const Header = ({ alertCount = 3 }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="plant-gradient p-2.5 rounded-xl shadow-glow">
              <Leaf className="w-6 h-6 text-primary-foreground leaf-float" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PlantIQ</h1>
              <p className="text-xs text-muted-foreground">AI Plant Care</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search plants, tips, insights..."
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-plant-attention text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
            <button className="p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ml-2">
              <span className="text-sm font-semibold text-secondary-foreground">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
