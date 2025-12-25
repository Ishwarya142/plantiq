import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";

interface ForecastDay {
  day: string;
  icon: React.ReactNode;
  high: number;
  low: number;
  rain: number;
}

const WeatherWidget = () => {
  const forecast: ForecastDay[] = [
    { day: "Today", icon: <Sun className="w-5 h-5 text-amber-500" />, high: 24, low: 18, rain: 0 },
    { day: "Tue", icon: <Cloud className="w-5 h-5 text-gray-400" />, high: 22, low: 16, rain: 10 },
    { day: "Wed", icon: <CloudRain className="w-5 h-5 text-blue-400" />, high: 19, low: 14, rain: 80 },
    { day: "Thu", icon: <CloudRain className="w-5 h-5 text-blue-400" />, high: 18, low: 13, rain: 60 },
    { day: "Fri", icon: <Sun className="w-5 h-5 text-amber-500" />, high: 23, low: 17, rain: 5 },
  ];

  return (
    <div className="card-plant p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Weather</h3>
            <p className="text-sm text-muted-foreground">Plant care forecast</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">San Francisco</p>
          </div>
        </div>

        {/* Current Weather */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl">
          <Sun className="w-14 h-14 text-amber-500" />
          <div className="flex-1">
            <p className="text-4xl font-bold text-foreground">24°C</p>
            <p className="text-sm text-muted-foreground">Sunny, clear skies</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Droplets className="w-3.5 h-3.5" />
              <span>45%</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Wind className="w-3.5 h-3.5" />
              <span>12 km/h</span>
            </div>
          </div>
        </div>

        {/* Plant Weather Alert */}
        <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-start gap-2">
            <CloudRain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Rain expected Wednesday</p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                Consider moving outdoor plants to shelter or delay watering until Thursday.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, index) => (
            <div 
              key={day.day}
              className="text-center p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
              <div className="flex justify-center mb-2">{day.icon}</div>
              <p className="text-sm font-semibold text-foreground">{day.high}°</p>
              <p className="text-xs text-muted-foreground">{day.low}°</p>
              {day.rain > 20 && (
                <div className="flex items-center justify-center gap-0.5 mt-1 text-blue-500">
                  <Droplets className="w-3 h-3" />
                  <span className="text-xs">{day.rain}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
