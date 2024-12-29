import { FIRECRAWL_CONFIG } from './config.ts';
import { AirbnbData, FirecrawlResponse } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  console.log('Starting Firecrawl request for URL:', airbnbUrl);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const requestBody = {
      url: airbnbUrl,
      limit: 1,
      wait: true,
      javascript: true,
      scrapeOptions: {
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

    const response = await fetch('https://api.firecrawl.co/api/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Firecrawl API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
    }

    const crawlResponse = await response.json() as FirecrawlResponse;
    console.log('Crawl response data:', {
      success: !!crawlResponse,
      dataLength: crawlResponse?.data?.length,
      firstResult: crawlResponse?.data?.[0]
    });

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
      description: content.description?.[0]
    };
  } catch (error) {
    console.error('Firecrawl API request failed:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      url: airbnbUrl,
      hasApiKey: !!apiKey
    });
    throw error;
  }
}