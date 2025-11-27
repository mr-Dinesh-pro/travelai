export interface TripPreferences {
  destination: string;
  days: number;
  budget: string;
  interests: string[];
  month: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: {
    lunch: string;
    dinner: string;
  };
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  misc: number;
  currency: string;
  total: number;
}

export interface TripPlan {
  destination: string;
  duration: string;
  summary: string;
  best_month_analysis: string;
  itinerary: ItineraryDay[];
  budget: BudgetBreakdown;
  hotels: { name: string; description: string; price_range: string }[];
  places_to_visit: { name: string; description: string }[];
  food_recommendations: string[];
  packing_list: string[];
  travel_tips: string[];
}

export type ViewState = 'FORM' | 'LOADING' | 'RESULT' | 'ERROR';

export interface AppState {
  view: ViewState;
  preferences: TripPreferences;
  tripPlan: TripPlan | null;
  error: string | null;
}