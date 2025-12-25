import { useState } from "react";
import Header from "@/components/Header";
import PlantCard from "@/components/PlantCard";
import PlantHealthScore from "@/components/PlantHealthScore";
import EnvironmentIndicators from "@/components/EnvironmentIndicators";
import GrowthPredictionChart from "@/components/GrowthPredictionChart";
import CareRecommendations from "@/components/CareRecommendations";
import AlertsPanel from "@/components/AlertsPanel";
import AIInsight from "@/components/AIInsight";
import IndoorOutdoorToggle from "@/components/IndoorOutdoorToggle";
import CareSchedule from "@/components/CareSchedule";
import WeatherWidget from "@/components/WeatherWidget";
import PlantStats from "@/components/PlantStats";
import WateringTracker from "@/components/WateringTracker";
import QuickActions from "@/components/QuickActions";
import PlantJournal from "@/components/PlantJournal";
import SeasonalTips from "@/components/SeasonalTips";
import PlantCollection from "@/components/PlantCollection";
import { Leaf, Plus, Sparkles } from "lucide-react";

import monsteraImg from "@/assets/monstera.jpg";
import fiddleLeafImg from "@/assets/fiddle-leaf.jpg";
import snakePlantImg from "@/assets/snake-plant.jpg";
import pothosImg from "@/assets/pothos.jpg";

interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  healthScore: number;
  isOutdoor: boolean;
  trend: "up" | "down" | "stable";
  environment: {
    temperature: number;
    humidity: number;
    light: number;
    rainfall?: number;
  };
}

const plants: Plant[] = [
  {
    id: "1",
    name: "Living Room Monstera",
    species: "Monstera Deliciosa",
    image: monsteraImg,
    healthScore: 87,
    isOutdoor: false,
    trend: "up",
    environment: { temperature: 22, humidity: 55, light: 2500 },
  },
  {
    id: "2",
    name: "Bedroom Fiddle",
    species: "Ficus Lyrata",
    image: fiddleLeafImg,
    healthScore: 62,
    isOutdoor: false,
    trend: "down",
    environment: { temperature: 20, humidity: 42, light: 1800 },
  },
  {
    id: "3",
    name: "Office Snake Plant",
    species: "Sansevieria",
    image: snakePlantImg,
    healthScore: 94,
    isOutdoor: false,
    trend: "stable",
    environment: { temperature: 23, humidity: 35, light: 1200 },
  },
  {
    id: "4",
    name: "Kitchen Pothos",
    species: "Epipremnum Aureum",
    image: pothosImg,
    healthScore: 78,
    isOutdoor: false,
    trend: "up",
    environment: { temperature: 24, humidity: 60, light: 3000 },
  },
];

const Index = () => {
  const [selectedPlantId, setSelectedPlantId] = useState(plants[0].id);
  const [isOutdoor, setIsOutdoor] = useState(false);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const collectionPlants = plants.map(p => ({
    name: p.name,
    species: p.species,
    health: p.healthScore,
    trend: p.trend,
    image: p.image,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={4} />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Greeting & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              {getGreeting()}
              <Leaf className="w-6 h-6 text-primary leaf-float" />
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-plant-healthy" />
              Your plants are thriving today
            </p>
          </div>
          <IndoorOutdoorToggle isOutdoor={isOutdoor} onChange={setIsOutdoor} />
        </div>

        {/* Quick Actions */}
        <div className="mb-6 animate-fade-in-up opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
          <QuickActions />
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <PlantStats />
        </div>

        {/* AI Insight & Seasonal Tips */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fade-in-up opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
            <AIInsight />
          </div>
          <div className="animate-fade-in-up opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
            <SeasonalTips />
          </div>
        </div>

        {/* Plant Selection */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Your Plants</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add Plant
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {plants.map((plant, index) => (
              <div 
                key={plant.id}
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <PlantCard
                  name={plant.name}
                  species={plant.species}
                  image={plant.image}
                  healthScore={plant.healthScore}
                  isSelected={plant.id === selectedPlantId}
                  onClick={() => setSelectedPlantId(plant.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Selected Plant Dashboard */}
        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Score & Environment */}
            <div className="card-plant p-6 animate-grow-in">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0">
                  <PlantHealthScore score={selectedPlant.healthScore} size="lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {selectedPlant.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{selectedPlant.species}</p>
                  <EnvironmentIndicators
                    temperature={selectedPlant.environment.temperature}
                    humidity={selectedPlant.environment.humidity}
                    light={selectedPlant.environment.light}
                    rainfall={selectedPlant.environment.rainfall}
                    isOutdoor={selectedPlant.isOutdoor}
                  />
                </div>
              </div>
            </div>

            {/* Growth Prediction */}
            <GrowthPredictionChart />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <CareSchedule />
          </div>
        </section>

        {/* Weather & Watering Section */}
        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <WeatherWidget />
          <WateringTracker />
        </section>

        {/* Care Recommendations & Alerts */}
        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <CareRecommendations />
          <AlertsPanel />
        </section>

        {/* Journal & Collection */}
        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <PlantJournal />
          <PlantCollection plants={collectionPlants} />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-muted-foreground text-sm border-t border-border/50">
          <p className="flex items-center justify-center gap-2">
            Made with
            <Leaf className="w-4 h-4 text-primary" />
            by PlantIQ
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
