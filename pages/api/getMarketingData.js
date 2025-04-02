import { fetchMarketingData } from '../../lib/fetchMarketingData';

export default async function handler(req, res) {
  try {
    const data = await fetchMarketingData();
    console.log('API getMarketingData response:', data);
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error in getMarketingData:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
