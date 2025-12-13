import { Thermometer, Droplets, Sun, CloudRain } from "lucide-react";

interface IndicatorProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: "good" | "warning" | "alert";
}

const Indicator = ({ icon, label, value, status }: IndicatorProps) => {
  const statusColors = {
    good: "bg-plant-healthy/10 text-plant-healthy border-plant-healthy/20",
    warning: "bg-plant-moderate/10 text-plant-moderate border-plant-moderate/20",
    alert: "bg-plant-attention/10 text-plant-attention border-plant-attention/20",
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${statusColors[status]} transition-all hover:scale-105`}>
      <div className="p-2 rounded-lg bg-background/50">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
};

interface EnvironmentIndicatorsProps {
  temperature: number;
  humidity: number;
  light: number;
  rainfall?: number;
  isOutdoor?: boolean;
}

const EnvironmentIndicators = ({ 
  temperature, 
  humidity, 
  light, 
  rainfall, 
  isOutdoor = false 
}: EnvironmentIndicatorsProps) => {
  const getTempStatus = (temp: number) => {
    if (temp >= 18 && temp <= 26) return "good";
    if (temp >= 15 && temp <= 30) return "warning";
    return "alert";
  };

  const getHumidityStatus = (hum: number) => {
    if (hum >= 40 && hum <= 60) return "good";
    if (hum >= 30 && hum <= 70) return "warning";
    return "alert";
  };

  const getLightStatus = (lux: number) => {
    if (lux >= 1000 && lux <= 5000) return "good";
    if (lux >= 500 && lux <= 8000) return "warning";
    return "alert";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Indicator
        icon={<Thermometer className="w-4 h-4" />}
        label="Temperature"
        value={`${temperature}°C`}
        status={getTempStatus(temperature)}
      />
      <Indicator
        icon={<Droplets className="w-4 h-4" />}
        label="Humidity"
        value={`${humidity}%`}
        status={getHumidityStatus(humidity)}
      />
      <Indicator
        icon={<Sun className="w-4 h-4" />}
        label="Light"
        value={`${light} lux`}
        status={getLightStatus(light)}
      />
      {isOutdoor && rainfall !== undefined && (
        <Indicator
          icon={<CloudRain className="w-4 h-4" />}
          label="Rainfall"
          value={`${rainfall}mm`}
          status={rainfall > 20 ? "warning" : "good"}
        />
      )}
    </div>
  );
};

export default EnvironmentIndicators;
