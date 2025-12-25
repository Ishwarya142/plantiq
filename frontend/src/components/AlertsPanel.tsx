import { AlertTriangle, CloudRain, Thermometer, Bug, Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Alert {
  id: string;
  type: "warning" | "critical" | "info";
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      icon: <AlertTriangle className="w-4 h-4" />,
      title: "Low Soil Moisture",
      message: "Your Monstera needs water soon. Soil moisture is critically low at 18%.",
      time: "Just now",
    },
    {
      id: "2",
      type: "warning",
      icon: <CloudRain className="w-4 h-4" />,
      title: "Rain Expected Tomorrow",
      message: "Consider moving outdoor plants to shelter or delaying watering.",
      time: "2 hours ago",
    },
    {
      id: "3",
      type: "warning",
      icon: <Thermometer className="w-4 h-4" />,
      title: "Temperature Drop Tonight",
      message: "Temperatures expected to drop to 12°C. Move sensitive plants indoors.",
      time: "4 hours ago",
    },
    {
      id: "4",
      type: "info",
      icon: <Bug className="w-4 h-4" />,
      title: "Pest Prevention Reminder",
      message: "Weekly check: Inspect leaves for signs of pests. Early detection is key!",
      time: "Yesterday",
    },
  ]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const typeStyles = {
    critical: "border-plant-attention/30 bg-plant-attention/5",
    warning: "border-plant-moderate/30 bg-plant-moderate/5",
    info: "border-primary/30 bg-primary/5",
  };

  const iconBgStyles = {
    critical: "bg-plant-attention/15 text-plant-attention",
    warning: "bg-plant-moderate/15 text-plant-moderate",
    info: "bg-primary/15 text-primary",
  };

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alerts</h3>
          {alerts.length > 0 && (
            <span className="bg-plant-attention text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No alerts right now.</p>
          <p className="text-sm">Your plants are doing great! 🌱</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-xl border transition-all animate-fade-in-up opacity-0",
                typeStyles[alert.type]
              )}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex gap-3">
                <div className={cn("p-2 rounded-lg flex-shrink-0 h-fit", iconBgStyles[alert.type])}>
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-foreground leading-tight">{alert.title}</h4>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 -mt-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
