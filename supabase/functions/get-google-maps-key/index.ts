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
    console.log('Fetching Google Maps API key');
    const api_key = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!api_key) {
      console.error('GOOGLE_MAPS_API_KEY not found in environment variables');
      throw new Error('GOOGLE_MAPS_API_KEY not configured');
    }

    console.log('Successfully retrieved Google Maps API key');
    
    return new Response(
      JSON.stringify({ api_key }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-google-maps-key function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    )
  }
})