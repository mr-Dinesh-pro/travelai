import { GoogleGenAI, Type } from "@google/genai";
import { TripPreferences, TripPlan } from "../types";

const tripSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    duration: { type: Type.STRING },
    summary: { type: Type.STRING },
    best_month_analysis: { type: Type.STRING },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          activities: { type: Type.ARRAY, items: { type: Type.STRING } },
          meals: {
            type: Type.OBJECT,
            properties: {
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
            }
          }
        }
      }
    },
    budget: {
      type: Type.OBJECT,
      properties: {
        accommodation: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        transportation: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        misc: { type: Type.NUMBER },
        currency: { type: Type.STRING },
        total: { type: Type.NUMBER }
      }
    },
    hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          price_range: { type: Type.STRING }
        }
      }
    },
    places_to_visit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    food_recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    packing_list: { type: Type.ARRAY, items: { type: Type.STRING } },
    travel_tips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["destination", "summary", "itinerary", "budget"]
};

export const generateTripPlan = async (prefs: TripPreferences): Promise<TripPlan> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Create a ${prefs.days}-day ${prefs.budget} style trip to ${prefs.destination} in ${prefs.month}.
    Interests: ${prefs.interests.join(", ")}.
    
    Return STRICT JSON.
    - Currency: Use the destination's local currency code.
    - Budget: Realistic numbers for 2025.
    - Itinerary: Detailed and logical flow.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tripSchema,
        temperature: 0.7,
      }
    });

    let text = response.text || "{}";
    // Strip markdown if present
    text = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(text) as TripPlan;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate plan. Please try again.");
  }
};