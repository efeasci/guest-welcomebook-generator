import { FIRECRAWL_CONFIG } from './config.ts';
import { AirbnbData, FirecrawlResponse } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FIRECRAWL_CONFIG.TIMEOUT);

  try {
    // Validate API key
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    // Log request details
    console.log('Starting Firecrawl request for URL:', airbnbUrl);
    
    const requestBody = {
      url: airbnbUrl,
      limit: 1,
      wait: true,
      javascript: true,
      scrapeOptions: {
        formats: ['markdown', 'html'],
        selectors: FIRECRAWL_CONFIG.SELECTORS
      }
    };

    console.log('Request configuration:', {
      url: FIRECRAWL_CONFIG.API_URL,
      method: 'POST',
      hasApiKey: !!apiKey,
      requestBody: JSON.stringify(requestBody, null, 2)
    });
    
    const response = await fetch(FIRECRAWL_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Log response details
    console.log('Firecrawl API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
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
      url: FIRECRAWL_CONFIG.API_URL,
      hasApiKey: !!apiKey
    });
    throw error;
  }
}