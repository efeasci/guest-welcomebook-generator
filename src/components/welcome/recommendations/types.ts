export interface Recommendation {
  name: string;
  description: string;
  address: string;
  photo: string;
  location: {
    lat: number;
    lng: number;
  };
}