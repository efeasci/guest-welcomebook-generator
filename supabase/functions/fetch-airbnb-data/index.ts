import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { airbnbUrl } = await req.json()
    console.log('Received request to fetch Airbnb data for URL:', airbnbUrl)

    if (!airbnbUrl) {
      throw new Error('No Airbnb URL provided')
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    console.log('API Key present:', !!apiKey)

    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not found in environment variables')
      throw new Error('FIRECRAWL_API_KEY not configured')
    }

    console.log('Making request to Firecrawl API...')
    
    try {
      const response = await fetch('https://api.firecrawl.co/api/v1/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: airbnbUrl,
          limit: 1,
          wait: true,
          javascript: true,
          scrapeOptions: {
            formats: ['markdown', 'html'],
            selectors: [
              { name: 'title', selector: '[data-testid="listing-title"]' },
              { name: 'image', selector: 'meta[property="og:image"]', attribute: 'content' },
              { name: 'checkIn', selector: '[data-testid="check-in-time"]' },
              { name: 'checkOut', selector: '[data-testid="check-out-time"]' },
              { name: 'houseRules', selector: '[data-testid="house-rules-section"] li' },
              { name: 'description', selector: '[data-testid="listing-description"]' }
            ]
          }
        })
      })

      console.log('Firecrawl API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Firecrawl API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`)
      }

      const crawlResponse = await response.json()
      console.log('Crawl response received:', {
        success: !!crawlResponse,
        dataLength: crawlResponse?.data?.length,
        responseStructure: Object.keys(crawlResponse)
      })

      if (!crawlResponse.data?.[0]) {
        throw new Error('No data received from Firecrawl API')
      }

      const content = crawlResponse.data[0]?.content || ''
      console.log('Extracted content:', content.substring(0, 200))
      
      // Extract data from the crawled content
      const extractedData = {
        title: extractTitle(content),
        image_url: extractImage(content),
        check_in: extractCheckInTime(content) || "15:00",
        check_out: extractCheckOutTime(content) || "11:00",
        check_in_method: extractCheckInMethod(content),
        house_rules: extractHouseRules(content),
        before_you_leave: extractBeforeYouLeave(content)
      }

      console.log('Extracted data:', extractedData)

      return new Response(
        JSON.stringify(extractedData),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 200 
        }
      )

    } catch (fetchError) {
      console.error('Fetch error details:', {
        message: fetchError.message,
        cause: fetchError.cause,
        stack: fetchError.stack
      })
      throw new Error(`Failed to fetch from Firecrawl API: ${fetchError.message}`)
    }

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

// Helper functions to extract specific data from crawled content
function extractTitle(content: string): string {
  const titleMatch = content.match(/<title>(.*?)<\/title>/) || 
                    content.match(/<h1[^>]*>(.*?)<\/h1>/);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractImage(content: string): string {
  const imageMatch = content.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
                    content.match(/<img[^>]+src="([^">]+)"/);
  return imageMatch ? imageMatch[1] : '';
}

function extractCheckInTime(content: string): string {
  const checkInMatch = content.match(/check.?in.*?(\d{1,2}:\d{2})/i) ||
                      content.match(/(\d{1,2}:\d{2})\s*(?:PM|AM)?\s*check.?in/i);
  return checkInMatch ? checkInMatch[1] : '';
}

function extractCheckOutTime(content: string): string {
  const checkOutMatch = content.match(/check.?out.*?(\d{1,2}:\d{2})/i) ||
                       content.match(/(\d{1,2}:\d{2})\s*(?:PM|AM)?\s*check.?out/i);
  return checkOutMatch ? checkOutMatch[1] : '';
}

function extractCheckInMethod(content: string): string {
  const methodSection = content.match(/check.?in.*?instructions?:(.*?)(?:<\/|$)/is);
  return methodSection ? methodSection[1].trim() : '';
}

function extractHouseRules(content: string): string[] {
  const rulesSection = content.match(/house\s*rules(.*?)(?:<\/section>|<section)/is);
  if (!rulesSection) return [];
  
  const rules = rulesSection[1].match(/<li[^>]*>(.*?)<\/li>/g);
  return rules 
    ? rules.map(rule => rule.replace(/<[^>]+>/g, '').trim())
          .filter(rule => rule.length > 0)
    : [];
}

function extractBeforeYouLeave(content: string): string[] {
  const checkoutSection = content.match(/(?:before\s+you\s+leave|checkout\s+instructions?)(.*?)(?:<\/section>|<section)/is);
  if (!checkoutSection) return [];
  
  const instructions = checkoutSection[1].match(/<li[^>]*>(.*?)<\/li>/g);
  return instructions 
    ? instructions.map(instruction => instruction.replace(/<[^>]+>/g, '').trim())
                 .filter(instruction => instruction.length > 0)
    : [];
}