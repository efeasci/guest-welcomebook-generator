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
      title: "Chic 1-bed in heart of Old Trafford - Free Parking",
      address: "Old Trafford, Manchester, United Kingdom",
      image_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      check_in: "14:00",
      check_out: "10:00",
      check_in_method: "Self check-in with smart lock",
      house_rules: [
        "3 guests maximum",
        "No pets",
        "Quiet hours 23:00 - 07:00",
        "No parties or events",
        "No commercial photography",
        "No smoking",
        "Late check out fee of £30.00 per hour",
        "Lost key fee of £30.00",
        "Lost/damaged car permit fee of £50.00"
      ],
      before_you_leave: [
        "Throw rubbish away",
        "Turn things off",
        "Lock up",
        "If you have used the car permit, kindly put back the car permit into the envelope and under the mat in the kitchen drawer as found."
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