import { AirbnbData } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  console.log('Starting Firecrawl request for URL:', airbnbUrl);
  
  try {
    const requestBody = {
      url: airbnbUrl,
      selectors: {
        title: '[data-testid="listing-title"]',
        image: 'meta[property="og:image"]',
        checkIn: '[data-testid="check-in-time"]',
        checkOut: '[data-testid="check-out-time"]',
        houseRules: '[data-testid="house-rules-section"] li'
      },
      javascript: true,
      wait: 2000
    };

    console.log('Making request to Firecrawl API with body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.firecrawl.dev/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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

    if (!crawlResponse.success) {
      throw new Error(crawlResponse.error || 'Failed to crawl website');
    }

    // Extract the data from the response
    const content = crawlResponse.data;
    return {
      title: content.title?.[0],
      image_url: content.image?.[0],
      check_in: content.checkIn?.[0] || "15:00",
      check_out: content.checkOut?.[0] || "11:00",
      house_rules: Array.isArray(content.houseRules) ? content.houseRules : [],
    };
  } catch (error) {
    console.error('Error in fetchFromFirecrawl:', error);
    throw error;
  }
}