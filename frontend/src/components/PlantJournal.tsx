import { BookOpen, Camera, Edit3, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  date: string;
  type: "note" | "photo" | "milestone";
  title: string;
  preview: string;
  plant: string;
}

const PlantJournal = () => {
  const entries: JournalEntry[] = [
    {
      id: "1",
      date: "Today",
      type: "note",
      title: "New leaf unfurling!",
      preview: "The Monstera is growing a beautiful new fenestrated leaf...",
      plant: "Living Room Monstera",
    },
    {
      id: "2",
      date: "Yesterday",
      type: "photo",
      title: "Weekly growth photo",
      preview: "Documenting weekly progress of the Fiddle Leaf...",
      plant: "Bedroom Fiddle",
    },
    {
      id: "3",
      date: "Dec 10",
      type: "milestone",
      title: "1 Year Anniversary! 🎉",
      preview: "Celebrating one year with my Snake Plant...",
      plant: "Office Snake Plant",
    },
    {
      id: "4",
      date: "Dec 8",
      type: "note",
      title: "Pest check - all clear",
      preview: "Weekly inspection complete. No signs of pests...",
      plant: "All Plants",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "note": return <Edit3 className="w-4 h-4" />;
      case "photo": return <Camera className="w-4 h-4" />;
      case "milestone": return <Calendar className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "note": return "bg-primary/10 text-primary";
      case "photo": return "bg-purple-500/10 text-purple-500";
      case "milestone": return "bg-amber-500/10 text-amber-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-semibold text-foreground">Plant Journal</h3>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Edit3 className="w-3.5 h-3.5" />
          New Entry
        </button>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 hover:bg-muted/30 cursor-pointer transition-all group",
              "animate-fade-in-up opacity-0"
            )}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg", getTypeStyle(entry.type))}>
                {getTypeIcon(entry.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm text-foreground truncate">{entry.title}</h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{entry.date}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{entry.preview}</p>
                <span className="text-xs text-primary font-medium">{entry.plant}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        View All Entries →
      </button>
    </div>
  );
};

export default PlantJournal;
