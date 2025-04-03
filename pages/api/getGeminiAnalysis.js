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
You are a Senior Marketing Analyst tasked with analyzing daily campaign performance for ${date} and providing a multi-level report for optimization and strategic planning.
Data (CSV format):
${csvData}

Analyze the following columns:
- Date
- PowerBI Name (campaign name)
- Units (units sold and orders)
- GMV (Gross Merchandise Value)
- PP% (prepaid percentage)
- Spents Total (total spend)
- FB Spent (Facebook spend)
- GA Spent (Google Ads spend)
- OtherSpent (other spend)

Provide your analysis in plain text, structured as follows:

1. **Key Metrics Summary**:
   - Total Units Sold: Sum of Units
   - Total GMV: Sum of GMV (convert negative GMV values, e.g., "(36,158)" to -36158)
   - Total Spend: Sum of Spents Total
   - Total FB Spend: Sum of FB Spent
   - Total GA Spend: Sum of GA Spent
   - Total Other Spend: Sum of OtherSpent
   - Average PP%: Average of PP% (round to 1 decimal)
   - Average ROAS: GMV / Spents Total (round to 1 decimal, handle 0 spend as 0 ROAS)
   - Average CAC: Spents Total / Units (round to nearest integer, handle 0 units as 0 CAC)
   - Average ASP: GMV / Units (round to nearest integer, handle 0 units as 0 ASP)

2. **Top Performers**:
   - List the top 3 campaigns by GMV (include PowerBI Name, GMV, Units Sold).

3. **Daily Optimization Recommendations** (2-3 insights):
   - Focus on immediate actions (e.g., adjust bids, pause underperforming campaigns).
   - Use metrics like ROAS, CAC, and spend allocation (FB, GA, Other).
   - Highlight specific campaigns where applicable.

4. **Strategic Insights** (2-3 insights):
   - Provide longer-term recommendations (e.g., channel reallocation, data improvement).
   - Consider trends in PP%, spend efficiency, or missing data patterns.

Ensure all monetary values use the ₹ symbol and integers (no decimals). Return your response in plain text, with sections clearly separated by newlines.
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
