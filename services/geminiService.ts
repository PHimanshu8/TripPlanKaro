
import { GoogleGenAI, Type } from "@google/genai";
import type { TravelPlan, TravelPreferences } from "../types";

// Note: You must have an API_KEY environment variable set for this to work
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destination: {
      type: Type.STRING,
      description: "The suggested travel destination city and country."
    },
    destinationDescription: {
      type: Type.STRING,
      description: "A brief, engaging description of the destination."
    },
    bestSeasonToVisit: {
      type: Type.STRING,
      description: "The best season or months to visit the destination."
    },
    touristSpots: {
      type: Type.ARRAY,
      description: "A list of suggested tourist spots at the destination.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the tourist spot." },
          description: { type: Type.STRING, description: "Brief description of the spot." },
          // imageUrl: { type: Type.STRING, description: "image URL for the spot ." }
        },
        required: ["name", "description"]
      }
    },
    dailyItinerary: {
      type: Type.ARRAY,
      description: "A day-by-day itinerary for the trip.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number of the trip (e.g., 1, 2, 3)." },
          date: { type: Type.STRING, description: "The specific date for this day's plan in YYYY-MM-DD format." },
          title: { type: Type.STRING, description: "A catchy title for the day's activities." },
          activities: {
            type: Type.ARRAY,
            description: "A list of activities for the day.",
            items: { type: Type.STRING }
          }
        },
        required: ["day", "date", "title", "activities"]
      }
    },
    transportationPlan: {
      type: Type.OBJECT,
      description: "Suggested transportation methods.",
      properties: {
        fromSourceToDestination: {
          type: Type.ARRAY,
          description: "Options for traveling from the source to the destination.",
          items: {
            type: Type.OBJECT,
            properties: {
              mode: { type: Type.STRING, description: "Mode of transport (e.g., Plane, Train, Car)." },
              details: { type: Type.STRING, description: "Details like estimated duration, cost, or booking advice." }
            },
            required: ["mode", "details"]
          }
        }
      },
      required: ["fromSourceToDestination"]
    },
    approximateBudget: {
        type: Type.STRING,
        description: "The approximate budget for the trip in Indian Rupees."
    }
  },
  required: ["destination", "destinationDescription", "bestSeasonToVisit", "touristSpots", "dailyItinerary", "transportationPlan", "approximateBudget"]
};


function constructPrompt(preferences: TravelPreferences): string {
  const { source, destination, startDate, endDate, budget } = preferences;

  const duration = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1;

  let prompt = `Generate a detailed travel itinerary.
- Source: ${source}
- Start Date: ${startDate}
- End Date: ${endDate}
- Duration: ${duration} days
- Budget: ${budget}`;

  if (destination) {
    prompt += `\n- Destination: ${destination}`;
  } else {
    prompt += `\n- Destination: Please suggest a suitable destination for me based on the source and dates. It should be an interesting and feasible trip.`;
  }
  
  prompt += `\n\nPlease provide a complete travel plan in JSON format. For each tourist spot, include a publicly accessible image URL. The plan should include a suggested destination (if not provided), a description of it, the best season to visit, a list of tourist spots, a detailed daily itinerary, transportation suggestions from the source to the destination, and an approximate budget for the trip in Indian Rupees. Ensure each day in the itinerary has a specific date corresponding to the travel period.`;
  
  return prompt;
}

export async function generateTravelPlan(preferences: TravelPreferences): Promise<TravelPlan> {
  const prompt = constructPrompt(preferences);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelPlanSchema,
      },
    });
    
    // The Gemini API returns a stringified JSON in the text property when a schema is provided.
    const jsonText = response.text.trim();
    // It is sometimes wrapped in markdown ```json ... ```, so let's clean that.
    const cleanedJsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    
    const travelPlan: TravelPlan = JSON.parse(cleanedJsonText);
    console.log(travelPlan);
    return travelPlan;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate travel plan from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the travel plan.");
  }
}
