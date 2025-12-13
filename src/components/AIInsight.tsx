import { Sparkles, TrendingUp, ArrowRight } from "lucide-react";

const AIInsight = () => {
  return (
    <div className="plant-gradient rounded-3xl p-6 text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
            AI Insight of the Day
          </span>
        </div>
        
        <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-4">
          "Moving your Monstera 30cm closer to the window this week could improve growth by 
          <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-white/20 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            18%
          </span>
          based on current light patterns."
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-80">
            <p>Based on: Light analysis, Growth history, Species data</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all font-semibold text-sm group">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInsight;
