import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getCategoryConfig = (category: string) => {
  switch (category) {
    case "Places to Eat":
      return {
        type: "restaurant",
        radius: 3200, // 2 miles in meters
        minRating: 4,
        description: "restaurants"
      };
    case "Coffee Shops":
      return {
        type: "cafe",
        radius: 3200,
        minRating: 4,
        description: "cafes and coffee shops"
      };
    case "Bars & Wineries":
      return {
        type: "bar",
        radius: 3200,
        minRating: 4,
        description: "bars and pubs"
      };
    case "Nearest Shopping":
      return {
        type: "supermarket",
        radius: 1600, // 1 mile in meters
        minRating: 3,
        description: "grocery stores and supermarkets"
      };
    case "Things to Do":
      return {
        type: "tourist_attraction",
        radius: 8000, // 5 miles in meters
        minRating: 4,
        description: "attractions and activities"
      };
    default:
      return {
        type: "point_of_interest",
        radius: 3200,
        minRating: 4,
        description: "places"
      };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, category, listingId } = await req.json()
    console.log('Generating recommendations for:', { address, category, listingId });
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        }
      }
    )
    
    const config = getCategoryConfig(category);
    
    // First get the geocoded location for the address
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
    );
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results?.[0]?.geometry?.location) {
      throw new Error('Could not geocode address');
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location;
    console.log('Geocoded location:', { lat, lng });
    
    // Search for places using the Places API
    const placesResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${config.radius}&type=${config.type}&minrating=${config.minRating}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
    );
    const placesData = await placesResponse.json();
    
    if (!placesData.results) {
      throw new Error('No places found');
    }
    
    // Filter and sort places by rating
    const topPlaces = placesData.results
      .filter((place: any) => place.rating >= config.minRating)
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 5);
    
    console.log('Found top places:', topPlaces.length);
    
    // Get more details for each place
    const detailedPlaces = await Promise.all(
      topPlaces.map(async (place: any) => {
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,photos,geometry&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
        );
        const detailsData = await detailsResponse.json();
        return detailsData.result;
      })
    );
    
    // Generate descriptions using AI
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))
    const descriptions = await Promise.all(
      detailedPlaces.map(async (place: any) => {
        const prompt = `Write a short, engaging description for ${place.name}, which is a ${config.description} located at ${place.formatted_address}. Include its rating of ${place.rating} stars if relevant. Keep it concise and informative.`;
        
        const response = await hf.textGeneration({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
          }
        });
        
        return response.generated_text.trim();
      })
    );
    
    // Prepare recommendations for database insertion
    const recommendations = detailedPlaces.map((place: any, index: number) => ({
      listing_id: listingId,
      category,
      name: place.name,
      description: descriptions[index],
      address: place.formatted_address,
      location: place.geometry.location,
      photo: place.photos?.[0]?.photo_reference 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
        : null
    }));
    
    console.log('Saving recommendations:', recommendations.length);
    
    // Insert recommendations using Supabase client
    const { data: savedRecommendations, error: insertError } = await supabaseClient
      .from('listing_recommendations')
      .insert(recommendations)
      .select();

    if (insertError) {
      console.error('Error saving recommendations:', insertError);
      throw new Error('Failed to save recommendations');
    }

    console.log('Successfully saved recommendations:', savedRecommendations?.length);

    return new Response(
      JSON.stringify({ 
        success: true,
        recommendations: savedRecommendations 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})