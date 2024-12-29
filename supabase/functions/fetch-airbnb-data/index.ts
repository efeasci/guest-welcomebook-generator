import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js';

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

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY not configured')
    }

    const firecrawl = new FirecrawlApp({ apiKey })
    console.log('Crawling Airbnb URL:', airbnbUrl)

    const crawlResponse = await firecrawl.crawlUrl(airbnbUrl, {
      limit: 1,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    })

    if (!crawlResponse.success) {
      throw new Error('Failed to crawl Airbnb page')
    }

    console.log('Crawl response:', crawlResponse)

    // Extract data from the crawled content
    const data = crawlResponse.data[0]
    if (!data) {
      throw new Error('No data found in crawl response')
    }

    // Parse the crawled content to extract relevant information
    const extractedData = {
      title: extractTitle(data.content),
      image_url: extractImage(data.content),
      check_in: extractCheckInTime(data.content),
      check_out: extractCheckOutTime(data.content),
      check_in_method: extractCheckInMethod(data.content),
      house_rules: extractHouseRules(data.content),
      before_you_leave: extractBeforeYouLeave(data.content)
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
  // Look for title in meta tags or h1
  const titleMatch = content.match(/<title>(.*?)<\/title>/) || 
                    content.match(/<h1[^>]*>(.*?)<\/h1>/);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractImage(content: string): string {
  // Look for the first image in the main content area
  const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imageMatch ? imageMatch[1] : '';
}

function extractCheckInTime(content: string): string {
  // Look for check-in time pattern (e.g., "14:00")
  const checkInMatch = content.match(/check.?in.*?(\d{1,2}:\d{2})/i);
  return checkInMatch ? checkInMatch[1] : '';
}

function extractCheckOutTime(content: string): string {
  // Look for check-out time pattern
  const checkOutMatch = content.match(/check.?out.*?(\d{1,2}:\d{2})/i);
  return checkOutMatch ? checkOutMatch[1] : '';
}

function extractCheckInMethod(content: string): string {
  // Look for check-in method information
  const methodMatch = content.match(/self check.?in|keypad|lockbox/i);
  return methodMatch ? methodMatch[0] : '';
}

function extractHouseRules(content: string): string[] {
  // Look for house rules section and extract list items
  const rulesMatch = content.match(/house rules(.*?)(?=<\/section>|<section)/is);
  if (!rulesMatch) return [];
  
  const rules = rulesMatch[1].match(/<li[^>]*>(.*?)<\/li>/g);
  return rules ? rules.map(rule => rule.replace(/<[^>]+>/g, '').trim())
                     .filter(rule => rule.length > 0) : [];
}

function extractBeforeYouLeave(content: string): string[] {
  // Look for checkout instructions or "before you leave" section
  const leaveMatch = content.match(/before you leave|checkout instructions(.*?)(?=<\/section>|<section)/is);
  if (!leaveMatch) return [];
  
  const instructions = leaveMatch[1].match(/<li[^>]*>(.*?)<\/li>/g);
  return instructions ? instructions.map(instruction => instruction.replace(/<[^>]+>/g, '').trim())
                                  .filter(instruction => instruction.length > 0) : [];
}