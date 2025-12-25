import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle } from "lucide-react";

interface DataPoint {
  day: string;
  actual?: number;
  predicted: number;
  stress?: boolean;
}

const growthData: DataPoint[] = [
  { day: "Mon", actual: 2.1, predicted: 2.1 },
  { day: "Tue", actual: 2.3, predicted: 2.4 },
  { day: "Wed", actual: 2.5, predicted: 2.6 },
  { day: "Thu", actual: 2.4, predicted: 2.8, stress: true },
  { day: "Fri", actual: 2.7, predicted: 3.0 },
  { day: "Sat", actual: 2.9, predicted: 3.2 },
  { day: "Sun", actual: 3.1, predicted: 3.4 },
  { day: "Mon", predicted: 3.6 },
  { day: "Tue", predicted: 3.8 },
  { day: "Wed", predicted: 4.0, stress: true },
  { day: "Thu", predicted: 4.1 },
  { day: "Fri", predicted: 4.3 },
  { day: "Sat", predicted: 4.5 },
  { day: "Sun", predicted: 4.7 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-glow">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {data.actual !== undefined && (
          <p className="text-sm text-plant-healthy">
            Actual: {data.actual} cm
          </p>
        )}
        <p className="text-sm text-primary">
          Predicted: {data.predicted} cm
        </p>
        {data.stress && (
          <div className="flex items-center gap-1 mt-2 text-plant-moderate text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Stress period detected</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const GrowthPredictionChart = () => {
  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Growth Prediction</h3>
          <p className="text-sm text-muted-foreground">14-day growth forecast</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-plant-healthy" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Predicted</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--plant-healthy))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--plant-healthy))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}cm`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--plant-healthy))"
              strokeWidth={2}
              fill="url(#actualGradient)"
              dot={{ fill: 'hsl(var(--plant-healthy))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(var(--plant-healthy))' }}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#predictedGradient)"
              dot={(props: any) => {
                const { cx, cy, payload, index } = props;
                if (payload.stress) {
                  return (
                    <circle
                      key={`dot-${index}`}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill="hsl(var(--plant-moderate))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="hsl(var(--primary))"
                    stroke="none"
                  />
                );
              }}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <AlertTriangle className="w-4 h-4 text-plant-moderate flex-shrink-0" />
        <span>Stress periods highlighted indicate potential growth slowdown due to environmental factors.</span>
      </div>
    </div>
  );
};

export default GrowthPredictionChart;
