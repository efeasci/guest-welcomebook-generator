import { FIRECRAWL_CONFIG } from './config.ts';
import { AirbnbData, FirecrawlResponse } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FIRECRAWL_CONFIG.TIMEOUT);

  try {
    console.log('Making request to Firecrawl API...');
    
    const response = await fetch(FIRECRAWL_CONFIG.API_URL, {
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
          selectors: FIRECRAWL_CONFIG.SELECTORS
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    console.log('Crawl response received:', {
      success: !!crawlResponse,
      dataLength: crawlResponse?.data?.length
    });

    if (!crawlResponse.data?.[0]) {
      throw new Error('No data received from Firecrawl API');
    }

    const content = crawlResponse.data[0].content;
    return {
      title: content.title?.[0],
      image_url: content.image?.[0],
      check_in: content.checkIn?.[0] || "15:00",
      check_out: content.checkOut?.[0] || "11:00",
      house_rules: content.houseRules,
      description: content.description?.[0]
    };
  } catch (error) {
    console.error('Fetch error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack
    });
    throw new Error(`Failed to fetch from Firecrawl API: ${error.message}`);
  }
}