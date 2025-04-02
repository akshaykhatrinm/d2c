export default function GeminiSummary({ analysis }) {
  return (
    <div className="gemini-summary">
      <h2>Summary of Key Metrics and Insights</h2>
      {analysis ? (
        <ul>
          {analysis.split('\n').map((line, index) => {
            if (line.trim()) {
              // Replace $ with ₹ and remove decimals for numbers
              const formattedLine = line
                .replace(/\$([\d,]+(\.\d+)?)/g, (match, num) => `₹${Math.round(parseFloat(num.replace(/,/g, '')))}`)
                .replace(/(\d+\.\d+)/g, (match) => Math.round(parseFloat(match)));
              return <li key={index}>{formattedLine}</li>;
            }
            return null;
          })}
        </ul>
      ) : (
        <p>No analysis available.</p>
      )}
    </div>
  );
}
