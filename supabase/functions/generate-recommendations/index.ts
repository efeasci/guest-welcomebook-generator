import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address, category } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    const prompt = `Generate 5 specific recommendations for ${category} near ${address}. Format the response as a JSON array with objects containing 'name' and 'description' properties. Keep descriptions concise and informative.`

    const response = await hf.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
      }
    })

    let recommendations = []
    try {
      // Extract JSON from the response
      const jsonStr = response.generated_text.match(/\[.*\]/s)?.[0]
      if (jsonStr) {
        recommendations = JSON.parse(jsonStr)
      }
    } catch (e) {
      console.error('Error parsing recommendations:', e)
    }

    // Get place details and photos using Google Places API
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec: any) => {
        const placeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
            rec.name + ' near ' + address
          )}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
        )
        const placeData = await placeResponse.json()
        
        if (placeData.results && placeData.results[0]) {
          const place = placeData.results[0]
          return {
            ...rec,
            address: place.formatted_address,
            location: place.geometry.location,
            photo: place.photos?.[0]?.photo_reference 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
              : null
          }
        }
        return rec
      })
    )

    return new Response(
      JSON.stringify({ recommendations: enrichedRecommendations }),
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