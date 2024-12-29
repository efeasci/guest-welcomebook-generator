export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const FIRECRAWL_CONFIG = {
  API_URL: 'https://api.firecrawl.co/api/v1/crawl',
  TIMEOUT: 30000,
  SELECTORS: [
    { name: 'title', selector: '[data-testid="listing-title"]' },
    { name: 'image', selector: 'meta[property="og:image"]', attribute: 'content' },
    { name: 'checkIn', selector: '[data-testid="check-in-time"]' },
    { name: 'checkOut', selector: '[data-testid="check-out-time"]' },
    { name: 'houseRules', selector: '[data-testid="house-rules-section"] li' },
    { name: 'description', selector: '[data-testid="listing-description"]' }
  ]
};