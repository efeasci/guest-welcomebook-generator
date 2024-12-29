import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    console.log('Received request with address:', address, 'and category:', category)
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    const prompt = `Generate exactly 5 specific recommendations for ${category} near ${address}. Format the response as a JSON array with objects containing 'name' and 'description' properties. Keep descriptions concise and informative.`

    console.log('Generating recommendations with prompt:', prompt)

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
      const jsonStr = response.generated_text.match(/\[.*\]/s)?.[0]
      if (jsonStr) {
        recommendations = JSON.parse(jsonStr)
        console.log('Parsed recommendations:', recommendations)
      }
    } catch (e) {
      console.error('Error parsing recommendations:', e)
      throw new Error('Failed to parse recommendations')
    }

    // Get existing recommendations to avoid duplicates
    const { data: existingRecs, error: fetchError } = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/listing_recommendations?select=name`,
      {
        headers: {
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
      }
    ).then(r => r.json())

    if (fetchError) {
      console.error('Error fetching existing recommendations:', fetchError)
    }

    const existingNames = new Set(existingRecs?.map((r: any) => r.name.toLowerCase()))

    // Filter out duplicates
    recommendations = recommendations.filter((rec: any) => 
      !existingNames.has(rec.name.toLowerCase())
    )

    // Enrich with Google Places data
    const enrichedRecommendations = await Promise.all(
      recommendations.slice(0, 5).map(async (rec: any) => {
        console.log('Enriching recommendation:', rec.name)
        
        try {
          const placeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
              rec.name + ' near ' + address
            )}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
          )
          const placeData = await placeResponse.json()
          
          if (placeData.results && placeData.results[0]) {
            const place = placeData.results[0]
            console.log('Found place:', place.name, 'at address:', place.formatted_address)
            
            // Only use the recommendation if we found a valid place
            if (place.formatted_address && place.geometry?.location) {
              return {
                ...rec,
                address: place.formatted_address,
                location: place.geometry.location,
                photo: place.photos?.[0]?.photo_reference 
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${Deno.env.get('GOOGLE_MAPS_API_KEY')}`
                  : null
              }
            }
          }
          // Skip this recommendation if we couldn't find a valid place
          return null
        } catch (error) {
          console.error('Error enriching recommendation:', error)
          return null
        }
      })
    )

    // Filter out null results and take only valid recommendations
    const validRecommendations = enrichedRecommendations.filter(rec => rec !== null)

    console.log('Returning enriched recommendations:', validRecommendations)

    return new Response(
      JSON.stringify({ recommendations: validRecommendations }),
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