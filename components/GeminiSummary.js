export default function GeminiSummary({ analysis }) {
  return (
    <div className="mb-6 p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Daily Brief (Gemini AI)</h2>
      <pre className="whitespace-pre-wrap text-sm">{analysis || 'Loading analysis...'}</pre>
    </div>
  );
}
