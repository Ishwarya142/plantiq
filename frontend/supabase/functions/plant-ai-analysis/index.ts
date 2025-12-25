import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlantData {
  name: string;
  species: string;
  isOutdoor: boolean;
  environment: {
    temperature: number;
    humidity: number;
    light: number;
    soilMoisture?: number;
    rainfall?: number;
  };
  healthScore: number;
  lastWatered?: string;
  lastFertilized?: string;
}

interface AnalysisRequest {
  type: 'growth-prediction' | 'care-recommendation' | 'health-analysis' | 'daily-insight';
  plantData: PlantData;
  weatherForecast?: {
    date: string;
    tempHigh: number;
    tempLow: number;
    humidity: number;
    precipitation: number;
    condition: string;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, plantData, weatherForecast } = await req.json() as AnalysisRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing ${type} request for plant: ${plantData.name}`);

    const systemPrompt = `You are PlantIQ, an expert AI botanist and plant care specialist. You analyze environmental conditions and provide accurate, actionable plant care advice.

Your analysis considers:
- Temperature (optimal range varies by species, generally 18-24°C for most houseplants)
- Humidity (40-60% ideal for most plants)
- Light intensity (measured in percentage, 60-80% for most plants)
- Soil moisture (40-60% optimal)
- Rainfall patterns (for outdoor plants)
- Weather forecasts for growth predictions

Always provide specific, actionable recommendations with reasoning. Be warm and encouraging like a friendly plant expert.`;

    let userPrompt = '';

    switch (type) {
      case 'growth-prediction':
        userPrompt = `Analyze growth prediction for this plant:
Plant: ${plantData.name} (${plantData.species})
Location: ${plantData.isOutdoor ? 'Outdoor' : 'Indoor'}
Current Health Score: ${plantData.healthScore}/100
Environment:
- Temperature: ${plantData.environment.temperature}°C
- Humidity: ${plantData.environment.humidity}%
- Light: ${plantData.environment.light}%
- Soil Moisture: ${plantData.environment.soilMoisture || 'Unknown'}%
${plantData.isOutdoor && plantData.environment.rainfall ? `- Recent Rainfall: ${plantData.environment.rainfall}mm` : ''}

${weatherForecast ? `Weather Forecast (next 7 days):
${weatherForecast.map(d => `${d.date}: ${d.condition}, High: ${d.tempHigh}°C, Low: ${d.tempLow}°C, Humidity: ${d.humidity}%, Precipitation: ${d.precipitation}mm`).join('\n')}` : ''}

Provide a 14-day growth prediction with:
1. Expected growth rate (percentage)
2. Predicted health trajectory
3. Risk periods to watch
4. Key factors affecting growth

Respond in JSON format:
{
  "growthRate": number (percentage),
  "healthTrajectory": "improving" | "stable" | "declining",
  "predictions": [{"day": number, "growthPercent": number, "healthScore": number, "riskLevel": "low" | "medium" | "high"}],
  "riskPeriods": [{"startDay": number, "endDay": number, "reason": string}],
  "keyFactors": [{"factor": string, "impact": "positive" | "negative", "description": string}],
  "summary": string
}`;
        break;

      case 'care-recommendation':
        userPrompt = `Generate personalized care recommendations for:
Plant: ${plantData.name} (${plantData.species})
Location: ${plantData.isOutdoor ? 'Outdoor' : 'Indoor'}
Health Score: ${plantData.healthScore}/100
Environment:
- Temperature: ${plantData.environment.temperature}°C
- Humidity: ${plantData.environment.humidity}%
- Light: ${plantData.environment.light}%
- Soil Moisture: ${plantData.environment.soilMoisture || 'Unknown'}%
${plantData.lastWatered ? `- Last Watered: ${plantData.lastWatered}` : ''}
${plantData.lastFertilized ? `- Last Fertilized: ${plantData.lastFertilized}` : ''}

Provide specific care recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "watering" | "light" | "temperature" | "humidity" | "fertilizer" | "pruning",
      "priority": "high" | "medium" | "low",
      "title": string,
      "description": string,
      "reason": string,
      "timing": string
    }
  ],
  "overallAssessment": string
}`;
        break;

      case 'health-analysis':
        userPrompt = `Perform detailed health analysis for:
Plant: ${plantData.name} (${plantData.species})
Location: ${plantData.isOutdoor ? 'Outdoor' : 'Indoor'}
Current Health Score: ${plantData.healthScore}/100
Environment:
- Temperature: ${plantData.environment.temperature}°C (${plantData.environment.temperature < 15 ? 'Cold stress risk' : plantData.environment.temperature > 30 ? 'Heat stress risk' : 'Normal'})
- Humidity: ${plantData.environment.humidity}% (${plantData.environment.humidity < 30 ? 'Too dry' : plantData.environment.humidity > 70 ? 'Too humid' : 'Normal'})
- Light: ${plantData.environment.light}% (${plantData.environment.light < 40 ? 'Low light' : plantData.environment.light > 80 ? 'High light' : 'Normal'})
- Soil Moisture: ${plantData.environment.soilMoisture || 'Unknown'}%

Analyze and respond in JSON format:
{
  "healthScore": number,
  "status": "Healthy" | "Moderate Stress" | "Needs Attention" | "Critical",
  "stressFactors": [{"factor": string, "severity": "mild" | "moderate" | "severe", "description": string}],
  "environmentalAnalysis": {
    "temperature": {"status": "optimal" | "warning" | "critical", "recommendation": string},
    "humidity": {"status": "optimal" | "warning" | "critical", "recommendation": string},
    "light": {"status": "optimal" | "warning" | "critical", "recommendation": string},
    "soilMoisture": {"status": "optimal" | "warning" | "critical", "recommendation": string}
  },
  "immediateActions": [string],
  "longTermCare": [string]
}`;
        break;

      case 'daily-insight':
        userPrompt = `Generate a helpful daily insight for:
Plant: ${plantData.name} (${plantData.species})
Location: ${plantData.isOutdoor ? 'Outdoor' : 'Indoor'}
Health Score: ${plantData.healthScore}/100
Current Conditions:
- Temperature: ${plantData.environment.temperature}°C
- Humidity: ${plantData.environment.humidity}%
- Light: ${plantData.environment.light}%
- Soil Moisture: ${plantData.environment.soilMoisture || 50}%

${weatherForecast && weatherForecast.length > 0 ? `Today's Weather: ${weatherForecast[0].condition}, High: ${weatherForecast[0].tempHigh}°C` : ''}

Provide ONE specific, actionable insight that would help this plant thrive. Focus on what the user can do TODAY.

Respond in JSON format:
{
  "insight": string (the main insight, 1-2 sentences, specific and actionable),
  "impact": string (expected benefit, e.g., "improve growth by 15%"),
  "basedOn": [string] (factors this insight is based on),
  "confidence": number (0-100)
}`;
        break;
    }

    console.log(`Sending request to Lovable AI for ${type}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log(`Received AI response for ${type}`);

    // Parse JSON from response
    let parsedResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedResult = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      parsedResult = { raw: content };
    }

    return new Response(JSON.stringify({ 
      type,
      result: parsedResult,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in plant-ai-analysis:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
