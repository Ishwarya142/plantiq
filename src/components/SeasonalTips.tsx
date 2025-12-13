import { Snowflake, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tip {
  id: string;
  title: string;
  description: string;
  action: string;
}

const SeasonalTips = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tips: Tip[] = [
    {
      id: "1",
      title: "Winter Watering",
      description: "Reduce watering frequency by 50% during winter months. Most plants enter dormancy and require less water.",
      action: "Adjust Schedule",
    },
    {
      id: "2",
      title: "Increase Humidity",
      description: "Indoor heating reduces humidity. Group plants together or use a humidifier to maintain 40-60% humidity.",
      action: "Learn More",
    },
    {
      id: "3",
      title: "Maximize Light",
      description: "With shorter days, move plants closer to windows. Clean leaves to maximize light absorption.",
      action: "Check Light Levels",
    },
    {
      id: "4",
      title: "Pause Fertilizing",
      description: "Stop fertilizing during winter dormancy. Resume feeding in early spring when new growth appears.",
      action: "Update Schedule",
    },
  ];

  const nextTip = () => setCurrentIndex((prev) => (prev + 1) % tips.length);
  const prevTip = () => setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);

  return (
    <div className="plant-gradient rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
      {/* Decorative snowflakes */}
      <div className="absolute top-4 right-4 opacity-20">
        <Snowflake className="w-20 h-20" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-10">
        <Snowflake className="w-12 h-12" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
              Winter Care Tips
            </span>
            <span className="text-xs ml-2 opacity-60">
              {currentIndex + 1} / {tips.length}
            </span>
          </div>
        </div>

        <div className="min-h-[100px]">
          <h4 className="text-lg font-bold mb-2">{tips[currentIndex].title}</h4>
          <p className="text-sm opacity-90 leading-relaxed mb-4">
            {tips[currentIndex].description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
            {tips[currentIndex].action}
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={prevTip}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextTip}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {tips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentIndex ? "bg-white w-6" : "bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeasonalTips;
