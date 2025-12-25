import { useState } from "react";
import { Droplets, Camera, Plus, Calendar, BookOpen, Settings, Loader2, Sparkles, Leaf, Check, ChevronRight, Sun, Thermometer, CloudRain, Sprout, Bell, Image, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { usePlantAI } from "@/hooks/usePlantAI";
import { useIsMobile } from "@/hooks/use-mobile";

interface Action {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  action: () => void;
}

const QuickActions = () => {
  const [wateringOpen, setWateringOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [addPlantOpen, setAddPlantOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState("");
  const [waterAmount, setWaterAmount] = useState([250]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [completedTasks, setCompletedTasks] = useState<number[]>([0]);
  
  const [newPlant, setNewPlant] = useState({
    name: "",
    species: "",
    location: "indoor",
    lightNeeds: "medium",
    notes: ""
  });
  
  const { getHealthAnalysis, getCareRecommendations, isLoading } = usePlantAI();
  const isMobile = useIsMobile();

  const handleWaterPlant = () => {
    if (!selectedPlant) {
      toast.error("Please select a plant to water");
      return;
    }
    toast.success(`Watered ${selectedPlant} with ${waterAmount[0]}ml`, {
      description: "Watering logged successfully!",
      icon: <Droplets className="w-4 h-4 text-blue-500" />
    });
    setWateringOpen(false);
    setSelectedPlant("");
    setWaterAmount([250]);
  };

  const handleScanPlant = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const steps = [
      { progress: 20, label: "Analyzing environment..." },
      { progress: 40, label: "Measuring light levels..." },
      { progress: 60, label: "Checking humidity..." },
      { progress: 80, label: "Running AI diagnosis..." },
      { progress: 100, label: "Generating recommendations..." }
    ];

    for (const step of steps) {
      setScanStep(step.label);
      setScanProgress(step.progress);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const scannedData = {
        temperature: 22 + Math.random() * 8,
        humidity: 50 + Math.random() * 30,
        light: 500 + Math.random() * 1000,
        soilMoisture: 30 + Math.random() * 50,
        rainfall: Math.random() * 10,
        isIndoor: Math.random() > 0.5
      };
      
      const plantData = {
        name: "Scanned Plant",
        species: "Unknown",
        isOutdoor: !scannedData.isIndoor,
        environment: {
          temperature: scannedData.temperature,
          humidity: scannedData.humidity,
          light: scannedData.light,
          soilMoisture: scannedData.soilMoisture,
          rainfall: scannedData.rainfall
        },
        healthScore: 75
      };
      
      const [healthResult, careResult] = await Promise.all([
        getHealthAnalysis(plantData),
        getCareRecommendations(plantData)
      ]);
      
      setScanResult({ 
        health_analysis: healthResult, 
        recommendations: careResult?.recommendations || [],
        scannedData 
      });
      toast.success("Plant scanned successfully!", {
        icon: <Sparkles className="w-4 h-4 text-purple-500" />
      });
    } catch (error) {
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
      setScanProgress(0);
      setScanStep("");
    }
  };

  const handleAddPlant = () => {
    if (!newPlant.name || !newPlant.species) {
      toast.error("Please fill in plant name and species");
      return;
    }
    toast.success(`${newPlant.name} added to your collection!`, {
      description: `${newPlant.species} - ${newPlant.location}`,
      icon: <Leaf className="w-4 h-4 text-green-500" />
    });
    setAddPlantOpen(false);
    setNewPlant({ name: "", species: "", location: "indoor", lightNeeds: "medium", notes: "" });
  };

  const toggleTask = (index: number) => {
    setCompletedTasks(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const actions: Action[] = [
    { 
      icon: <Droplets className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Water", 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverBg: "hover:bg-blue-500/20 hover:shadow-blue-500/20",
      action: () => setWateringOpen(true)
    },
    { 
      icon: <Camera className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Scan", 
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      hoverBg: "hover:bg-purple-500/20 hover:shadow-purple-500/20",
      action: () => setScanOpen(true)
    },
    { 
      icon: <Plus className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Add Plant", 
      color: "text-plant-healthy",
      bgColor: "bg-plant-healthy/10",
      hoverBg: "hover:bg-plant-healthy/20 hover:shadow-plant-healthy/20",
      action: () => setAddPlantOpen(true)
    },
    { 
      icon: <Calendar className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Schedule", 
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      hoverBg: "hover:bg-amber-500/20 hover:shadow-amber-500/20",
      action: () => setScheduleOpen(true)
    },
    { 
      icon: <BookOpen className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Journal", 
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      hoverBg: "hover:bg-rose-500/20 hover:shadow-rose-500/20",
      action: () => setJournalOpen(true)
    },
    { 
      icon: <Settings className="w-5 h-5 icon transition-transform duration-300" />, 
      label: "Settings", 
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      hoverBg: "hover:bg-muted hover:shadow-muted/20",
      action: () => setSettingsOpen(true)
    },
  ];

  const plants = ["Monstera Deliciosa", "Fiddle Leaf Fig", "Snake Plant", "Pothos"];

  const WateringContent = () => (
    <div className="space-y-6 p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Plant</Label>
        <div className="grid grid-cols-2 gap-2">
          {plants.map((plant, i) => (
            <button
              key={plant}
              onClick={() => setSelectedPlant(plant)}
              className={cn(
                "p-3 rounded-xl text-left text-sm font-medium transition-all duration-200 border-2",
                "animate-fade-in-up opacity-0",
                selectedPlant === plant 
                  ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-md" 
                  : "border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20"
              )}
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'forwards' }}
            >
              <Leaf className="w-4 h-4 mb-1 inline-block mr-1" />
              {plant}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium">Water Amount</Label>
          <span className="text-lg font-bold text-blue-500">{waterAmount[0]}ml</span>
        </div>
        <div className="relative pt-2">
          <Slider
            value={waterAmount}
            onValueChange={setWaterAmount}
            max={500}
            min={50}
            step={25}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />50ml</span>
            <span className="flex items-center gap-1"><Droplets className="w-4 h-4" />500ml</span>
          </div>
        </div>
        <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((waterAmount[0] - 50) / 450) * 100}%` }}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleWaterPlant} 
        disabled={!selectedPlant}
        className={cn(
          "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300",
          "shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]",
          !selectedPlant && "opacity-50 cursor-not-allowed"
        )}
      >
        <Droplets className="w-4 h-4 mr-2" />
        Log Watering
      </Button>
    </div>
  );

  const ScanContent = () => (
    <div className="space-y-6 p-4">
      {!scanResult ? (
        <div className="text-center space-y-6">
          <div className="relative w-36 h-36 mx-auto">
            <div className={cn(
              "absolute inset-0 rounded-full bg-purple-500/10 flex items-center justify-center",
              isScanning && "animate-pulse"
            )}>
              {isScanning ? (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 scan-ring" />
                  <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 scan-ring" style={{ animationDelay: '0.5s' }} />
                  <Loader2 className="w-14 h-14 text-purple-500 animate-spin" />
                </>
              ) : (
                <Camera className="w-14 h-14 text-purple-500 transition-transform hover:scale-110" />
              )}
            </div>
          </div>
          
          {isScanning ? (
            <div className="space-y-3 animate-fade-in-up">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{scanStep}</p>
              <Progress value={scanProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{scanProgress}% complete</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">Scan your plant to get AI-powered health predictions</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {[
                  { icon: Thermometer, label: "Temperature" },
                  { icon: CloudRain, label: "Humidity" },
                  { icon: Sun, label: "Light" },
                  { icon: Sprout, label: "Soil" }
                ].map(({ icon: Icon, label }, i) => (
                  <span 
                    key={label}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <Icon className="w-3 h-3" /> {label}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleScanPlant} 
            disabled={isScanning}
            className={cn(
              "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
              "shadow-lg hover:shadow-purple-500/30 transition-all duration-300",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Start AI Scan
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-plant-healthy animate-slide-in-right">
            <div className="w-8 h-8 rounded-full bg-plant-healthy/20 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <span className="font-semibold">AI Analysis Complete</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Temperature", value: `${scanResult.scannedData.temperature?.toFixed(1) ?? '--'}°C`, icon: Thermometer, color: "text-orange-500" },
              { label: "Humidity", value: `${scanResult.scannedData.humidity?.toFixed(0) ?? '--'}%`, icon: CloudRain, color: "text-blue-500" },
              { label: "Light", value: `${scanResult.scannedData.light?.toFixed(0) ?? '--'} lux`, icon: Sun, color: "text-amber-500" },
              { label: "Soil Moisture", value: `${scanResult.scannedData.soilMoisture?.toFixed(0) ?? '--'}%`, icon: Sprout, color: "text-green-500" }
            ].map((item, i) => (
              <div 
                key={item.label}
                className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up opacity-0 group cursor-default"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <item.icon className={cn("w-3 h-3", item.color)} />
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </div>
                <p className="font-semibold group-hover:scale-105 transition-transform">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-plant-healthy/10 to-plant-healthy/5 border border-plant-healthy/20 animate-grow-in">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-plant-healthy flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Health Score
              </p>
              <span className="text-xs px-2 py-1 rounded-full bg-plant-healthy/20 text-plant-healthy">Excellent</span>
            </div>
            <div className="flex items-end gap-2">
              <div className="text-4xl font-bold">{scanResult.health_analysis?.health_score || 85}</div>
              <div className="text-muted-foreground mb-1">/100</div>
            </div>
            <Progress value={scanResult.health_analysis?.health_score || 85} className="h-2 mt-2" />
          </div>

          {scanResult.recommendations && scanResult.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm">Recommendations:</p>
              {scanResult.recommendations.slice(0, 3).map((rec: any, i: number) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-muted/30 text-sm flex items-start gap-3 hover:bg-muted/50 transition-colors animate-slide-in-right opacity-0 cursor-pointer group"
                  style={{ animationDelay: `${(i + 4) * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary group-hover:translate-x-1 transition-transform" />
                  <div>
                    <span className="font-medium text-primary">{rec.category}:</span>
                    <span className="ml-1 text-muted-foreground">{rec.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button 
            variant="outline" 
            onClick={() => setScanResult(null)}
            className="w-full hover:bg-purple-500/10 hover:border-purple-500/50 transition-all"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Another Plant
          </Button>
        </div>
      )}
    </div>
  );

  const AddPlantContent = () => (
    <div className="space-y-4 p-4">
      <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <Label className="flex items-center gap-1">
          Plant Name <span className="text-destructive">*</span>
        </Label>
        <Input 
          placeholder="My lovely Monstera"
          value={newPlant.name}
          onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
          className="transition-all focus:ring-2 focus:ring-plant-healthy/30"
        />
      </div>
      <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <Label className="flex items-center gap-1">
          Species <span className="text-destructive">*</span>
        </Label>
        <Input 
          placeholder="Monstera Deliciosa"
          value={newPlant.species}
          onChange={(e) => setNewPlant({...newPlant, species: e.target.value})}
          className="transition-all focus:ring-2 focus:ring-plant-healthy/30"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={newPlant.location} onValueChange={(v) => setNewPlant({...newPlant, location: v})}>
            <SelectTrigger className="transition-all hover:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indoor">🏠 Indoor</SelectItem>
              <SelectItem value="outdoor">🌳 Outdoor</SelectItem>
              <SelectItem value="balcony">🌇 Balcony</SelectItem>
              <SelectItem value="greenhouse">🌿 Greenhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Light Needs</Label>
          <Select value={newPlant.lightNeeds} onValueChange={(v) => setNewPlant({...newPlant, lightNeeds: v})}>
            <SelectTrigger className="transition-all hover:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🌑 Low Light</SelectItem>
              <SelectItem value="medium">⛅ Medium Light</SelectItem>
              <SelectItem value="bright">🌤️ Bright Indirect</SelectItem>
              <SelectItem value="direct">☀️ Direct Sun</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2 animate-fade-in-up opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
        <Label>Notes</Label>
        <Textarea 
          placeholder="Any special care notes..."
          value={newPlant.notes}
          onChange={(e) => setNewPlant({...newPlant, notes: e.target.value})}
          rows={3}
          className="resize-none transition-all focus:ring-2 focus:ring-plant-healthy/30"
        />
      </div>
      <Button 
        onClick={handleAddPlant} 
        disabled={!newPlant.name || !newPlant.species}
        className={cn(
          "w-full bg-gradient-to-r from-plant-healthy to-emerald-500 hover:from-emerald-600 hover:to-plant-healthy",
          "shadow-lg hover:shadow-plant-healthy/30 transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          "animate-fade-in-up opacity-0"
        )}
        style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
      >
        <Leaf className="w-4 h-4 mr-2" />
        Add to Collection
      </Button>
    </div>
  );

  const ScheduleContent = () => {
    const tasks = [
      { plant: "Monstera", task: "Water", time: "Today, 9:00 AM", icon: Droplets, color: "text-blue-500" },
      { plant: "Fiddle Leaf", task: "Mist leaves", time: "Today, 2:00 PM", icon: CloudRain, color: "text-cyan-500" },
      { plant: "Snake Plant", task: "Check soil", time: "Tomorrow", icon: Sprout, color: "text-green-500" },
      { plant: "Pothos", task: "Fertilize", time: "In 3 days", icon: Sparkles, color: "text-amber-500" },
    ];

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
          <Progress value={(completedTasks.length / tasks.length) * 100} className="w-24 h-2" />
        </div>
        <div className="space-y-2">
          {tasks.map((item, i) => {
            const done = completedTasks.includes(i);
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => toggleTask(i)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300",
                  "animate-fade-in-up opacity-0 text-left",
                  done 
                    ? "bg-muted/30 border-muted opacity-60" 
                    : "bg-card border-transparent hover:border-primary/30 hover:shadow-md"
                )}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  done 
                    ? "bg-plant-healthy border-plant-healthy" 
                    : "border-muted-foreground/40 hover:border-primary"
                )}>
                  {done && <Check className="w-4 h-4 text-white animate-scale-in" />}
                </div>
                <Icon className={cn("w-5 h-5 transition-colors", done ? "text-muted-foreground" : item.color)} />
                <div className="flex-1">
                  <p className={cn("font-medium transition-all", done && "line-through text-muted-foreground")}>{item.plant}</p>
                  <p className="text-sm text-muted-foreground">{item.task}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-medium", done ? "text-muted-foreground" : "text-foreground")}>{item.time}</p>
                  {done && <span className="text-xs text-plant-healthy font-medium">Done ✓</span>}
                </div>
              </button>
            );
          })}
        </div>
        <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary/50 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add New Task
        </Button>
      </div>
    );
  };

  const JournalContent = () => (
    <div className="space-y-4 p-4">
      <div className="animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <Textarea 
          placeholder="Write about your plant's progress today..."
          rows={4}
          className="resize-none transition-all focus:ring-2 focus:ring-rose-500/30"
        />
      </div>
      <div className="flex gap-2 animate-fade-in-up opacity-0" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <Button variant="outline" size="sm" className="flex-1 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all">
          <Image className="w-4 h-4 mr-1" />
          Photo
        </Button>
        <Button variant="outline" size="sm" className="flex-1 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all">
          <Leaf className="w-4 h-4 mr-1" />
          Milestone
        </Button>
        <Button variant="outline" size="sm" className="flex-1 hover:bg-purple-500/10 hover:border-purple-500/50 transition-all">
          <TrendingUp className="w-4 h-4 mr-1" />
          Growth
        </Button>
      </div>
      <Button 
        className={cn(
          "w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
          "shadow-lg hover:shadow-rose-500/30 transition-all",
          "hover:scale-[1.02] active:scale-[0.98]",
          "animate-fade-in-up opacity-0"
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        Save Entry
      </Button>
      
      <div className="pt-4 border-t space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Recent Entries</p>
        {[
          { date: "Dec 14", note: "New leaf unfurling on Monstera! 🌱", mood: "🎉" },
          { date: "Dec 12", note: "Repotted the snake plant into larger container", mood: "💪" },
        ].map((entry, i) => (
          <div 
            key={i} 
            className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group animate-fade-in-up opacity-0"
            style={{ animationDelay: `${(i + 3) * 50}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{entry.date}</p>
              <span className="group-hover:scale-125 transition-transform">{entry.mood}</span>
            </div>
            <p className="text-sm mt-1">{entry.note}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsContent = () => {
    const settings = [
      { label: "Notifications", description: "Watering reminders & alerts", icon: Bell, enabled: true },
      { label: "Dark Mode", description: "Toggle dark theme", icon: Sun, enabled: false },
      { label: "Data Sync", description: "Last synced: Just now", icon: CloudRain, enabled: true },
    ];

    return (
      <div className="space-y-3 p-4">
        {settings.map((setting, i) => (
          <div 
            key={i} 
            className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 flex items-center justify-between transition-all animate-fade-in-up opacity-0 group"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <setting.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{setting.label}</p>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
            </div>
            <Switch defaultChecked={setting.enabled} />
          </div>
        ))}
        
        <div className="pt-4 border-t animate-fade-in-up opacity-0" style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}>
          <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive/50">
            Reset All Settings
          </Button>
        </div>
      </div>
    );
  };

  const DialogWrapper = ({ open, onOpenChange, title, description, children }: any) => {
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto">{children}</div>
          </DrawerContent>
        </Drawer>
      );
    }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="card-plant p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <button
              key={action.label}
              onClick={action.action}
              className={cn(
                "action-btn icon-bounce flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
                action.bgColor,
                action.hoverBg,
                action.color,
                "animate-fade-in-up opacity-0",
                "hover:scale-105 hover:shadow-lg active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              {action.icon}
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <DialogWrapper open={wateringOpen} onOpenChange={setWateringOpen} title="Water Plant" description="Log watering for your plants">
        <WateringContent />
      </DialogWrapper>

      <DialogWrapper open={scanOpen} onOpenChange={(open: boolean) => { setScanOpen(open); if (!open) { setScanResult(null); setScanProgress(0); setScanStep(""); } }} title="AI Plant Scanner" description="Get instant health predictions">
        <ScanContent />
      </DialogWrapper>

      <DialogWrapper open={addPlantOpen} onOpenChange={setAddPlantOpen} title="Add New Plant" description="Add a plant to your collection">
        <AddPlantContent />
      </DialogWrapper>

      <DialogWrapper open={scheduleOpen} onOpenChange={setScheduleOpen} title="Care Schedule" description="Your upcoming plant care tasks">
        <ScheduleContent />
      </DialogWrapper>

      <DialogWrapper open={journalOpen} onOpenChange={setJournalOpen} title="Plant Journal" description="Document your plant journey">
        <JournalContent />
      </DialogWrapper>

      <DialogWrapper open={settingsOpen} onOpenChange={setSettingsOpen} title="Settings" description="Customize your PlantIQ experience">
        <SettingsContent />
      </DialogWrapper>
    </>
  );
};

export default QuickActions;
