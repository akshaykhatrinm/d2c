import ReactMarkdown from 'react-markdown';

export default function GeminiSummary({ analysis }) {
  // Clean up the analysis text: replace $ with ₹ and remove decimals
  const formattedAnalysis = analysis
    ? analysis
        .replace(/\$([\d,]+(\.\d+)?)/g, (match, num) => `₹${Math.round(parseFloat(num.replace(/,/g, '')))}`)
        .replace(/(\d+\.\d+)/g, (match) => Math.round(parseFloat(match)))
    : 'No analysis available.';

  return (
    <div className="gemini-summary">
      <h2>Summary of Key Metrics and Insights</h2>
      <ReactMarkdown>{formattedAnalysis}</ReactMarkdown>
    </div>
  );
}
