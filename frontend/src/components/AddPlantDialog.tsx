import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Camera, Sparkles, Leaf, Loader2, Check, X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PlantIdentification {
  identified: boolean;
  name: string;
  species: string;
  confidence: number;
  description: string;
  careInfo: {
    light: string;
    water: string;
    humidity: string;
    temperature: string;
  };
  healthTips: string[];
  suggestedHealthScore: number;
}

interface AddPlantDialogProps {
  onPlantAdded?: () => void;
}

const AddPlantDialog = ({ onPlantAdded }: AddPlantDialogProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"upload" | "identify" | "details" | "saving">("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identification, setIdentification] = useState<PlantIdentification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [plantName, setPlantName] = useState("");
  const [species, setSpecies] = useState("");
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [notes, setNotes] = useState("");
  const [environment, setEnvironment] = useState({
    temperature: 22,
    humidity: 50,
    light: 60,
    soilMoisture: 50,
  });

  const resetForm = () => {
    setStep("upload");
    setImagePreview(null);
    setImageFile(null);
    setIdentification(null);
    setPlantName("");
    setSpecies("");
    setIsOutdoor(false);
    setNotes("");
    setEnvironment({ temperature: 22, humidity: 50, light: 60, soilMoisture: 50 });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setStep("identify");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const identifyPlant = async () => {
    if (!imagePreview) return;
    
    setIsIdentifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("identify-plant", {
        body: { imageBase64: imagePreview }
      });

      if (error) throw error;

      if (data?.result?.identified) {
        setIdentification(data.result);
        setPlantName(data.result.name || "");
        setSpecies(data.result.species || "");
        toast.success("Plant identified successfully!");
      } else {
        toast.info("Could not identify this plant. Please enter details manually.");
      }
      setStep("details");
    } catch (error) {
      console.error("Identification error:", error);
      toast.error("Failed to identify plant. Please enter details manually.");
      setStep("details");
    } finally {
      setIsIdentifying(false);
    }
  };

  const skipIdentification = () => {
    setStep("details");
  };

  const savePlant = async () => {
    if (!plantName.trim()) {
      toast.error("Please enter a plant name");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to add plants");
      return;
    }

    setIsSaving(true);
    setStep("saving");

    try {
      let imageUrl = null;

      // Upload image if present
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("plant-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("plant-images")
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      // Save plant to database
      const { error } = await supabase.from("plants").insert({
        user_id: user.id,
        name: plantName.trim(),
        species: species.trim() || null,
        image_url: imageUrl,
        health_score: identification?.suggestedHealthScore || 75,
        is_outdoor: isOutdoor,
        temperature: environment.temperature,
        humidity: environment.humidity,
        light: environment.light,
        soil_moisture: environment.soilMoisture,
        notes: notes.trim() || null,
        ai_care_tips: identification?.healthTips?.join("\n") || null,
      });

      if (error) throw error;

      toast.success(`${plantName} added to your collection!`);
      onPlantAdded?.();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save plant. Please try again.");
      setStep("details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Plant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Add New Plant
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                "hover:border-primary hover:bg-primary/5",
                "border-muted-foreground/30"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Upload a photo of your plant</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag & drop or click to browse
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Camera className="w-4 h-4" />
                  <span>Our AI will identify your plant automatically</span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep("details")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Skip photo & add manually
            </Button>
          </div>
        )}

        {/* Step 2: Identify */}
        {step === "identify" && (
          <div className="space-y-4">
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden aspect-square max-h-64 mx-auto">
                <img
                  src={imagePreview}
                  alt="Plant preview"
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background"
                  onClick={() => { setImagePreview(null); setStep("upload"); }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 gradient-primary text-white"
                onClick={identifyPlant}
                disabled={isIdentifying}
              >
                {isIdentifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Identifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Identify with AI
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={skipIdentification}>
                Skip
              </Button>
            </div>

            {isIdentifying && (
              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyzing leaf patterns, color, and structure...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details */}
        {step === "details" && (
          <div className="space-y-5">
            {/* Identification Result */}
            {identification?.identified && (
              <div className="p-4 rounded-xl bg-plant-healthy/10 border border-plant-healthy/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-plant-healthy/20">
                    <Check className="w-5 h-5 text-plant-healthy" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-plant-healthy">Plant Identified!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {identification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Confidence: {identification.confidence}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Image Preview (small) */}
            {imagePreview && (
              <div className="flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Plant"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Photo added</p>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => { setStep("upload"); setImagePreview(null); }}
                  >
                    Change photo
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantName">Plant Name *</Label>
                  <Input
                    id="plantName"
                    placeholder="My Monstera"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Species</Label>
                  <Input
                    id="species"
                    placeholder="Monstera Deliciosa"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label htmlFor="outdoor" className="cursor-pointer">Outdoor Plant</Label>
                <Switch
                  id="outdoor"
                  checked={isOutdoor}
                  onCheckedChange={setIsOutdoor}
                />
              </div>

              {/* Environment Sliders */}
              <div className="space-y-4 p-4 rounded-xl bg-muted/30">
                <h4 className="font-medium text-sm">Current Environment</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className="font-medium">{environment.temperature}°C</span>
                    </div>
                    <Slider
                      value={[environment.temperature]}
                      onValueChange={([v]) => setEnvironment(e => ({ ...e, temperature: v }))}
                      min={10}
                      max={35}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Humidity</span>
                      <span className="font-medium">{environment.humidity}%</span>
                    </div>
                    <Slider
                      value={[environment.humidity]}
                      onValueChange={([v]) => setEnvironment(e => ({ ...e, humidity: v }))}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Light Level</span>
                      <span className="font-medium">{environment.light}%</span>
                    </div>
                    <Slider
                      value={[environment.light]}
                      onValueChange={([v]) => setEnvironment(e => ({ ...e, light: v }))}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Soil Moisture</span>
                      <span className="font-medium">{environment.soilMoisture}%</span>
                    </div>
                    <Slider
                      value={[environment.soilMoisture]}
                      onValueChange={([v]) => setEnvironment(e => ({ ...e, soilMoisture: v }))}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              {/* Care Tips from AI */}
              {identification?.healthTips && identification.healthTips.length > 0 && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Care Tips
                  </h4>
                  <ul className="space-y-1">
                    {identification.healthTips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Check className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about your plant..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setOpen(false); resetForm(); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 gradient-primary text-white"
                onClick={savePlant}
              >
                <Leaf className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Saving */}
        {step === "saving" && (
          <div className="py-8 text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
            <p className="font-medium">Adding {plantName} to your collection...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Uploading image and saving plant data
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPlantDialog;
