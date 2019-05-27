export interface TripDay {
  id: number;
  trip_id: number;
  user_id: number;
  name: string;
  trip_date: string;
  events: object;
  created_at: string;
  updated_at: string;
}
