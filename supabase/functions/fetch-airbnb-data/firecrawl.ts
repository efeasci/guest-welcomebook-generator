import { AirbnbData } from './types.ts';

export async function fetchFromFirecrawl(airbnbUrl: string, apiKey: string): Promise<AirbnbData> {
  console.log('Starting Firecrawl request for URL:', airbnbUrl);
  
  try {
    const requestBody = {
      url: airbnbUrl,
      limit: 1,
      scrapeRules: {
        title: {
          selector: '[data-testid="listing-title"]',
          type: 'text'
        },
        image: {
          selector: 'meta[property="og:image"]',
          type: 'attribute',
          attribute: 'content'
        },
        checkIn: {
          selector: '[data-testid="check-in-time"]',
          type: 'text'
        },
        checkOut: {
          selector: '[data-testid="check-out-time"]',
          type: 'text'
        },
        houseRules: {
          selector: '[data-testid="house-rules-section"] li',
          type: 'text',
          multiple: true
        }
      }
    };

    console.log('Making request to Firecrawl API with body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
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

    // Extract the data from the first result
    const content = crawlResponse.data[0];
    return {
      title: content.title,
      image_url: content.image,
      check_in: content.checkIn || "15:00",
      check_out: content.checkOut || "11:00",
      house_rules: Array.isArray(content.houseRules) ? content.houseRules : [],
    };
  } catch (error) {
    console.error('Error in fetchFromFirecrawl:', error);
    throw error;
  }
}