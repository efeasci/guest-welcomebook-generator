import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const AIRBNB_CLIENT_ID = Deno.env.get('AIRBNB_CLIENT_ID')
const AIRBNB_REDIRECT_URI = Deno.env.get('AIRBNB_REDIRECT_URI')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { redirectUrl } = await req.json()
    
    if (!AIRBNB_CLIENT_ID) {
      throw new Error('AIRBNB_CLIENT_ID not configured')
    }

    // Construct Airbnb OAuth URL
    const authUrl = `https://www.airbnb.com/oauth2/auth?` +
      `client_id=${AIRBNB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(AIRBNB_REDIRECT_URI || redirectUrl)}&` +
      `response_type=code&` +
      `scope=listings:read listings:write`

    return new Response(
      JSON.stringify({ authUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in airbnb-auth function:', error)
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