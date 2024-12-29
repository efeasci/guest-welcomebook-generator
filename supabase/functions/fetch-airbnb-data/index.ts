import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './config.ts';
import { fetchFromFirecrawl } from './firecrawl.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { airbnbUrl } = await req.json();
    console.log('Received request to fetch Airbnb data for URL:', airbnbUrl);

    if (!airbnbUrl) {
      throw new Error('No Airbnb URL provided');
    }

    // Validate URL format
    try {
      new URL(airbnbUrl);
    } catch {
      throw new Error('Invalid URL format');
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not found in environment variables');
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    console.log('Starting Firecrawl API request with valid configuration');
    const data = await fetchFromFirecrawl(airbnbUrl, apiKey);
    console.log('Successfully fetched and processed Airbnb data:', data);
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in fetch-airbnb-data function:', error);
    
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
        status: 400
      }
    );
  }
});