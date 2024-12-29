export interface AirbnbData {
  title?: string;
  image_url?: string;
  check_in?: string;
  check_out?: string;
  house_rules?: string[];
  description?: string;
}

export interface FirecrawlResponse {
  data: {
    content: {
      title?: string[];
      image?: string[];
      checkIn?: string[];
      checkOut?: string[];
      houseRules?: string[];
      description?: string[];
    }[];
  }[];
}