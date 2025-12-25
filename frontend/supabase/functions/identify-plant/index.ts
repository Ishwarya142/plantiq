import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    console.log("Identifying plant from uploaded image...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are PlantIQ, an expert botanist AI that can identify plants from images with high accuracy. 
            
When given a plant image, analyze it thoroughly and provide:
1. The common name of the plant
2. The scientific/species name
3. A confidence score (0-100)
4. Basic care requirements
5. A brief description

Always respond in valid JSON format with this structure:
{
  "identified": true/false,
  "name": "Common Name",
  "species": "Scientific Name",
  "confidence": 85,
  "description": "Brief description of the plant",
  "careInfo": {
    "light": "bright indirect",
    "water": "weekly",
    "humidity": "moderate",
    "temperature": "18-24°C"
  },
  "healthTips": ["tip1", "tip2", "tip3"],
  "suggestedHealthScore": 75
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please identify this plant and provide detailed care information. If you cannot identify a plant in the image, set identified to false and provide a helpful message."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
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
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log("Plant identification complete");

    // Parse JSON from response
    let parsedResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedResult = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      parsedResult = { 
        identified: false, 
        error: "Could not parse plant identification",
        raw: content 
      };
    }

    return new Response(JSON.stringify({ 
      result: parsedResult,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in identify-plant:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
