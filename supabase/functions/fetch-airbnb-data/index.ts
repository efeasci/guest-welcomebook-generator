import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { airbnbUrl } = await req.json()
    console.log('Received request to fetch Airbnb data for URL:', airbnbUrl)

    // For now, return mock data since we can't scrape Airbnb directly
    // In a production environment, you would implement proper Airbnb data fetching
    const mockData = {
      title: "Sample Airbnb Listing",
      address: "123 Sample Street, City",
      image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      check_in: "15:00",
      check_out: "11:00",
      house_rules: [
        "No smoking",
        "No parties",
        "Quiet hours after 10 PM"
      ]
    }

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-airbnb-data function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})