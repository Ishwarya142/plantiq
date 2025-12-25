import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Bell, Moon, Sun, Smartphone, Globe, Shield, 
  Trash2, ChevronRight, Droplets, Thermometer, Bug 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Settings = () => {
  const { resolvedTheme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    waterReminders: true,
    healthAlerts: true,
    weatherWarnings: true,
    pestAlerts: false,
    weeklyDigest: true,
  });

  const [preferences, setPreferences] = useState({
    temperatureUnit: "celsius",
    language: "english",
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Notification preference updated");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires confirmation. Please contact support.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative container mx-auto px-4 py-8 max-w-2xl">
        {/* Appearance */}
        <div className="bento-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    resolvedTheme === "light" && "bg-background shadow-sm"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    resolvedTheme === "dark" && "bg-background shadow-sm"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bento-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Water Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified when plants need water</p>
                </div>
              </div>
              <Switch
                checked={notifications.waterReminders}
                onCheckedChange={() => handleNotificationChange("waterReminders")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-plant-attention/10">
                  <Thermometer className="w-4 h-4 text-plant-attention" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Health Alerts</p>
                  <p className="text-sm text-muted-foreground">Alerts when plant health declines</p>
                </div>
              </div>
              <Switch
                checked={notifications.healthAlerts}
                onCheckedChange={() => handleNotificationChange("healthAlerts")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Globe className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Weather Warnings</p>
                  <p className="text-sm text-muted-foreground">Extreme weather notifications</p>
                </div>
              </div>
              <Switch
                checked={notifications.weatherWarnings}
                onCheckedChange={() => handleNotificationChange("weatherWarnings")}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-plant-moderate/10">
                  <Bug className="w-4 h-4 text-plant-moderate" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Pest Alerts</p>
                  <p className="text-sm text-muted-foreground">Pest detection notifications</p>
                </div>
              </div>
              <Switch
                checked={notifications.pestAlerts}
                onCheckedChange={() => handleNotificationChange("pestAlerts")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Summary of your plant care</p>
                </div>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={() => handleNotificationChange("weeklyDigest")}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bento-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Preferences
          </h3>
          
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-3 border-b border-border/30 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-foreground text-left">Temperature Unit</p>
                <p className="text-sm text-muted-foreground">Celsius (°C)</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-foreground text-left">Language</p>
                <p className="text-sm text-muted-foreground">English</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bento-card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy & Security
          </h3>
          
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between py-3 border-b border-border/30 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-foreground text-left">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-foreground text-left">Export Data</p>
                <p className="text-sm text-muted-foreground">Download your plant data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bento-card p-6 border-plant-attention/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-plant-attention">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl border border-plant-attention/50 text-plant-attention hover:bg-plant-attention/10 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;