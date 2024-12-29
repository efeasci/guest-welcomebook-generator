import { AirbnbData } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  console.log('Starting Firecrawl request for URL:', airbnbUrl);
  
  try {
    const requestBody = {
      url: airbnbUrl,
      options: {
        limit: 1,
        wait: true,
        javascript: true,
        selectors: [
          { selector: '[data-testid="listing-title"]', name: 'title' },
          { selector: 'meta[property="og:image"]', name: 'image', attribute: 'content' },
          { selector: '[data-testid="check-in-time"]', name: 'checkIn' },
          { selector: '[data-testid="check-out-time"]', name: 'checkOut' },
          { selector: '[data-testid="house-rules-section"] li', name: 'houseRules' }
        ]
      }
    };

    console.log('Making request to Firecrawl API with body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'Supabase Edge Function'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
    }

    const crawlResponse = await response.json();
    console.log('Crawl response:', crawlResponse);

    if (!crawlResponse.data?.[0]?.content) {
      throw new Error('No content received from Firecrawl API');
    }

    const content = crawlResponse.data[0].content;
    return {
      title: content.title?.[0],
      image_url: content.image?.[0],
      check_in: content.checkIn?.[0] || "15:00",
      check_out: content.checkOut?.[0] || "11:00",
      house_rules: content.houseRules || [],
    };
  } catch (error) {
    console.error('Error in fetchFromFirecrawl:', error);
    throw error;
  }
}