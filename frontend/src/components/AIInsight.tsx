import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import { usePlantAI, PlantData, DailyInsight } from "@/hooks/usePlantAI";

interface AIInsightProps {
  plantData?: PlantData;
}

const AIInsight = ({ plantData }: AIInsightProps) => {
  const { getDailyInsight, isLoading } = usePlantAI();
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsight = async () => {
    if (!plantData) return;
    
    const result = await getDailyInsight(plantData);
    if (result) {
      setInsight(result);
      setHasLoaded(true);
    }
  };

  useEffect(() => {
    if (plantData && !hasLoaded) {
      fetchInsight();
    }
  }, [plantData]);

  // Extract percentage from impact string if present
  const extractPercentage = (impact: string) => {
    const match = impact.match(/(\d+)%/);
    return match ? match[1] : null;
  };

  const percentage = insight?.impact ? extractPercentage(insight.impact) : null;

  return (
    <div className="plant-gradient rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
              AI Insight of the Day
            </span>
          </div>
          <button 
            onClick={fetchInsight}
            disabled={isLoading || !plantData}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
            title="Refresh insight"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {isLoading && !insight ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg opacity-80">Analyzing your plant...</span>
          </div>
        ) : insight ? (
          <>
            <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-4">
              "{insight.insight}
              {percentage && (
                <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-white/20 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                  {percentage}%
                </span>
              )}
              "
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm opacity-80">
                <p>Based on: {insight.basedOn.slice(0, 3).join(', ')}</p>
                {insight.confidence && (
                  <p className="mt-1">Confidence: {insight.confidence}%</p>
                )}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all font-semibold text-sm group">
                Learn More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-4">
            "Moving your plant closer to the window this week could improve growth by 
            <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-white/20 rounded-lg">
              <TrendingUp className="w-4 h-4" />
              18%
            </span>
            based on current light patterns."
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInsight;
