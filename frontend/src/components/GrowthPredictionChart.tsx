import { useState, useEffect, useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { AlertTriangle, TrendingUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { usePlantAI, PlantData, GrowthPrediction } from "@/hooks/usePlantAI";

interface GrowthPredictionChartProps {
  plantData?: PlantData;
}

const GrowthPredictionChart = ({ plantData }: GrowthPredictionChartProps) => {
  const { getGrowthPrediction, isLoading } = usePlantAI();
  const [aiPrediction, setAiPrediction] = useState<GrowthPrediction | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchPrediction = async () => {
    if (!plantData) return;
    
    const result = await getGrowthPrediction(plantData);
    if (result) {
      setAiPrediction(result);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    if (plantData && !hasLoaded) {
      fetchPrediction();
    }
  }, [plantData]);

  // Default data
  const defaultData = [
    { day: "Mon", actual: 2.1, predicted: 2.1 },
    { day: "Tue", actual: 2.3, predicted: 2.4 },
    { day: "Wed", actual: 2.5, predicted: 2.6 },
    { day: "Thu", actual: 2.4, predicted: 2.8, stress: true },
    { day: "Fri", actual: 2.7, predicted: 3.0 },
    { day: "Sat", actual: 2.9, predicted: 3.2 },
    { day: "Sun", actual: 3.1, predicted: 3.4 },
    { day: "Mon+", predicted: 3.6 },
    { day: "Tue+", predicted: 3.8 },
    { day: "Wed+", predicted: 4.0, stress: true },
    { day: "Thu+", predicted: 4.1 },
    { day: "Fri+", predicted: 4.3 },
    { day: "Sat+", predicted: 4.5 },
    { day: "Sun+", predicted: 4.7 },
  ];

  // Generate chart data based on AI prediction or default
  const chartData = useMemo(() => {
    if (aiPrediction?.predictions) {
      return aiPrediction.predictions.map((p, i) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date();
        date.setDate(date.getDate() + p.day - 7);
        const dayName = days[date.getDay()] + (p.day > 7 ? '+' : '');
        return {
          day: dayName,
          actual: p.day <= 7 ? p.growthPercent / 10 : undefined,
          predicted: p.growthPercent / 10,
          stress: p.riskLevel === 'high' || p.riskLevel === 'medium',
        };
      });
    }
    return defaultData;
  }, [aiPrediction]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-glow">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          {data.actual !== undefined && (
            <p className="text-sm text-plant-healthy">
              Actual: {data.actual.toFixed(1)} cm
            </p>
          )}
          <p className="text-sm text-primary">
            Predicted: {data.predicted.toFixed(1)} cm
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

  const trajectoryColors = {
    improving: 'text-plant-healthy',
    stable: 'text-plant-moderate',
    declining: 'text-plant-attention',
  };

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Growth Prediction
            {aiPrediction && <Sparkles className="w-4 h-4 text-primary" />}
          </h3>
          <p className="text-sm text-muted-foreground">
            {aiPrediction ? 'AI-powered 14-day forecast' : '14-day growth forecast'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {aiPrediction && (
            <div className={`flex items-center gap-1 text-sm ${trajectoryColors[aiPrediction.healthTrajectory]}`}>
              <TrendingUp className="w-4 h-4" />
              <span className="capitalize hidden sm:inline">{aiPrediction.healthTrajectory}</span>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-plant-healthy" />
              <span className="text-muted-foreground hidden sm:inline">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground hidden sm:inline">Predicted</span>
            </div>
          </div>
          <button 
            onClick={fetchPrediction}
            disabled={isLoading || !plantData}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-all disabled:opacity-50"
            title="Get AI prediction"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {isLoading && !aiPrediction ? (
        <div className="flex items-center justify-center h-64 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Analyzing growth patterns...</span>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
      )}
      
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <AlertTriangle className="w-4 h-4 text-plant-moderate flex-shrink-0" />
        <span>
          {aiPrediction?.summary || 'Stress periods highlighted indicate potential growth slowdown due to environmental factors.'}
        </span>
      </div>

      {aiPrediction?.keyFactors && aiPrediction.keyFactors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {aiPrediction.keyFactors.slice(0, 3).map((factor, i) => (
            <span 
              key={i}
              className={`text-xs px-2 py-1 rounded-full ${
                factor.impact === 'positive' 
                  ? 'bg-plant-healthy/10 text-plant-healthy' 
                  : 'bg-plant-attention/10 text-plant-attention'
              }`}
            >
              {factor.factor}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrowthPredictionChart;
