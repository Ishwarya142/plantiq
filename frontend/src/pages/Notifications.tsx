import { Bell, AlertTriangle, CloudRain, Thermometer, Bug, X, ArrowLeft, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  type: "warning" | "critical" | "info";
  icon: React.ReactNode;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "critical",
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Low Soil Moisture",
      message: "Your Monstera needs water soon. Soil moisture is critically low at 18%.",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      icon: <CloudRain className="w-5 h-5" />,
      title: "Rain Expected Tomorrow",
      message: "Consider moving outdoor plants to shelter or delaying watering.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      icon: <Thermometer className="w-5 h-5" />,
      title: "Temperature Drop Tonight",
      message: "Temperatures expected to drop to 12°C. Move sensitive plants indoors.",
      time: "4 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "info",
      icon: <Bug className="w-5 h-5" />,
      title: "Pest Prevention Reminder",
      message: "Weekly check: Inspect leaves for signs of pests. Early detection is key!",
      time: "Yesterday",
      read: true,
    },
    {
      id: "5",
      type: "info",
      icon: <Bell className="w-5 h-5" />,
      title: "Watering Complete",
      message: "You watered your Snake Plant. Next watering scheduled in 7 days.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-xl transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-plant-attention hover:bg-plant-attention/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Bell className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">All caught up!</h2>
            <p className="text-muted-foreground">No notifications right now. Your plants are doing great! 🌱</p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer animate-fade-in-up opacity-0",
                  typeStyles[notification.type],
                  !notification.read && "ring-2 ring-primary/20"
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl flex-shrink-0", iconBgStyles[notification.type])}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-2">{notification.time}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;