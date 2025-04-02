import { fetchMarketingData } from '../../lib/fetchMarketingData';
import Papa from 'papaparse';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }

  try {
    const data = await fetchMarketingData();
    const filteredData = data.filter(row => row.Date === date);
    if (!filteredData.length) {
      console.log(`No data for date ${date}`);
      return res.status(404).json({ error: 'No data found for the selected date' });
    }

    const csvData = Papa.unparse(filteredData);
    const prompt = `
      You are a Senior Marketing Analyst analyzing daily campaign performance for ${date}.
      Data (CSV format):
      ${csvData}
      Analyze the following columns:
      - Date
      - PowerBI Name (campaign name)
      - Units (units sold and orders)
      - GMV
      - PP% (prepaid percentage)
      - Spents Total (total spend)
      - FB Spent (Facebook spend)
      - GA Spent (Google Ads spend)
      - OtherSpent (other spend)
      Provide a summary of key metrics (e.g., total GMV, total spend, units sold) and 2-3 actionable insights.
      Return your response in plain text.
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const analysis = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis unavailable';
    console.log('Gemini analysis:', analysis);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in getGeminiAnalysis:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
}
