import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserPlant {
  id: string;
  name: string;
  species: string | null;
  image_url: string | null;
  health_score: number;
  is_outdoor: boolean;
  trend: 'up' | 'down' | 'stable';
  temperature: number;
  humidity: number;
  light: number;
  soil_moisture: number;
  last_watered: string | null;
  last_fertilized: string | null;
  notes: string | null;
  ai_care_tips: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserPlants() {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setPlants([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map database fields to UserPlant interface
      const mappedPlants: UserPlant[] = (data || []).map(plant => ({
        id: plant.id,
        name: plant.name,
        species: plant.species,
        image_url: plant.image_url,
        health_score: plant.health_score || 75,
        is_outdoor: plant.is_outdoor || false,
        trend: (plant.trend as 'up' | 'down' | 'stable') || 'stable',
        temperature: Number(plant.temperature) || 22,
        humidity: Number(plant.humidity) || 50,
        light: Number(plant.light) || 60,
        soil_moisture: Number(plant.soil_moisture) || 50,
        last_watered: plant.last_watered,
        last_fertilized: plant.last_fertilized,
        notes: plant.notes,
        ai_care_tips: plant.ai_care_tips,
        created_at: plant.created_at,
        updated_at: plant.updated_at,
      }));

      setPlants(mappedPlants);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch plants');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlant = useCallback(async (plantId: string) => {
    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', plantId);

      if (error) throw error;
      
      setPlants(prev => prev.filter(p => p.id !== plantId));
      return true;
    } catch (err) {
      console.error('Error deleting plant:', err);
      return false;
    }
  }, []);

  const updatePlant = useCallback(async (plantId: string, updates: Partial<UserPlant>) => {
    try {
      const { error } = await supabase
        .from('plants')
        .update(updates)
        .eq('id', plantId);

      if (error) throw error;
      
      setPlants(prev => prev.map(p => 
        p.id === plantId ? { ...p, ...updates } : p
      ));
      return true;
    } catch (err) {
      console.error('Error updating plant:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchPlants();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchPlants();
    });

    return () => subscription.unsubscribe();
  }, [fetchPlants]);

  return {
    plants,
    isLoading,
    error,
    refetch: fetchPlants,
    deletePlant,
    updatePlant,
  };
}
