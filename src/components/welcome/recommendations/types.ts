export interface Recommendation {
  id?: string;
  name: string;
  description: string;
  address: string;
  photo: string | null;
  location: {
    lat: number;
    lng: number;
  };
  category: string;
  listing_id?: string;
  created_at?: string;
}