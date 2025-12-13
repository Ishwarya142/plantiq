import { Droplets, Scissors, Leaf, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Task {
  id: string;
  type: "water" | "prune" | "fertilize" | "repot";
  plant: string;
  time: string;
  completed: boolean;
}

const taskIcons = {
  water: <Droplets className="w-4 h-4" />,
  prune: <Scissors className="w-4 h-4" />,
  fertilize: <Leaf className="w-4 h-4" />,
  repot: <Sparkles className="w-4 h-4" />,
};

const taskColors = {
  water: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  prune: "bg-amber-500/15 text-amber-600 border-amber-500/20",
  fertilize: "bg-plant-healthy/15 text-plant-healthy border-plant-healthy/20",
  repot: "bg-purple-500/15 text-purple-600 border-purple-500/20",
};

const CareSchedule = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", type: "water", plant: "Living Room Monstera", time: "9:00 AM", completed: false },
    { id: "2", type: "water", plant: "Kitchen Pothos", time: "9:00 AM", completed: true },
    { id: "3", type: "prune", plant: "Bedroom Fiddle", time: "2:00 PM", completed: false },
    { id: "4", type: "fertilize", plant: "Office Snake Plant", time: "Tomorrow", completed: false },
    { id: "5", type: "repot", plant: "Living Room Monstera", time: "Next Week", completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const todayTasks = tasks.filter(t => t.time !== "Tomorrow" && t.time !== "Next Week");
  const upcomingTasks = tasks.filter(t => t.time === "Tomorrow" || t.time === "Next Week");

  return (
    <div className="card-plant p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Care Schedule</h3>
          <p className="text-sm text-muted-foreground">Today's tasks & upcoming</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {tasks.filter(t => !t.completed).length} pending
        </span>
      </div>

      {/* Today */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</h4>
        <div className="space-y-2">
          {todayTasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                task.completed 
                  ? "bg-muted/30 border-border/50 opacity-60" 
                  : taskColors[task.type],
                "animate-fade-in-up opacity-0"
              )}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                task.completed ? "bg-plant-healthy text-white" : "bg-background"
              )}>
                {task.completed ? <Check className="w-4 h-4" /> : taskIcons[task.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)} {task.plant}
                </p>
                <p className="text-xs text-muted-foreground">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming</h4>
        <div className="space-y-2">
          {upcomingTasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
            >
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                {taskIcons[task.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)} {task.plant}
                </p>
                <p className="text-xs text-muted-foreground">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareSchedule;
