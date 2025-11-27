import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TripPreferences, TripPlan } from "../types";

const API_KEY = process.env.API_KEY || '';

// Define the structured output schema strictly
const tripSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING, description: "Confirmed destination name" },
    duration: { type: Type.STRING, description: "Total duration string (e.g., '5 Days')" },
    summary: { type: Type.STRING, description: "A catchy summary of the trip" },
    best_month_analysis: { type: Type.STRING, description: "Analysis of visiting in the selected month vs cheapest month" },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING, description: "Theme of the day" },
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
        accommodation: { type: Type.NUMBER, description: "Estimated cost for stay" },
        food: { type: Type.NUMBER, description: "Estimated cost for food" },
        transportation: { type: Type.NUMBER, description: "Estimated cost for travel" },
        activities: { type: Type.NUMBER, description: "Estimated cost for entry fees/tours" },
        misc: { type: Type.NUMBER, description: "Estimated buffer money" },
        currency: { type: Type.STRING, description: "Local currency code (e.g. USD, EUR, JPY)" },
        total: { type: Type.NUMBER, description: "Total estimated cost" }
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
  required: [
    "destination", "duration", "summary", "best_month_analysis", "itinerary", 
    "budget", "hotels", "places_to_visit", "food_recommendations", "packing_list", "travel_tips"
  ]
};

export const generateTripPlan = async (prefs: TripPreferences): Promise<TripPlan> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
    Act as a world-class travel planner. Create a detailed travel itinerary for a trip to ${prefs.destination}.
    
    Details:
    - Duration: ${prefs.days} days
    - Budget Level: ${prefs.budget}
    - Month of Travel: ${prefs.month}
    - Interests: ${prefs.interests.join(", ")}
    
    Requirements:
    1. Provide a day-by-day itinerary with morning, afternoon, and evening activities.
    2. Suggest 3 hotels fitting the budget.
    3. Breakdown the budget realistically in the local currency or USD.
    4. Compare the selected travel month with the cheapest/best time to visit.
    5. Include specific food recommendations and packing tips.
    
    Return the response strictly in JSON format matching the schema.
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

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TripPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};