
export type TravelBudget = 'Budget-Friendly' | 'Moderate' | 'Luxury';

export interface TravelPreferences {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: TravelBudget;
}

export interface TouristSpot {
  name: string;
  description: string;
  imageUrl: string;
}

export interface DailyItineraryItem {
  day: number;
  date: string;
  title: string;
  activities: string[];
}

export interface TransportationDetail {
  mode: string;
  details: string;
}

export interface TransportationPlan {
  fromSourceToDestination: TransportationDetail[];
}

export interface TravelPlan {
  destination: string;
  destinationDescription: string;
  bestSeasonToVisit: string;
  touristSpots: TouristSpot[];
  dailyItinerary: DailyItineraryItem[];
  transportationPlan: TransportationPlan;
  approximateBudget: string;
}
