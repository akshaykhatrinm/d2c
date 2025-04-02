export default function CampaignTable({ dailyData }) {
  const tableRows = dailyData.map(row => {
    const spend = parseFloat(row['Spents Total'] || 0);
    const gmv = parseFloat(row.GMV || 0);
    const units = parseInt(row.Units || 0);
    const asp = units ? gmv / units : 0;
    const cac = units ? spend / units : 0;
    const roas = spend ? gmv / spend : 0;
    const pp = parseFloat(row['PP%'] || 0);

    return {
      'Campaign Name': row['PowerBI Name'] || 'Unknown',
      'Spend (₹)': spend.toFixed(2),
      'GMV (₹)': gmv.toFixed(2),
      'Units Sold': units,
      ASP: asp.toFixed(2),
      CAC: cac.toFixed(2),
      ROAS: roas.toFixed(2),
      'PP%': pp.toFixed(2),
    };
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Campaign Performance</h2>
      {tableRows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(tableRows[0]).map(header => (
                  <th key={header} className="p-2 border font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="p-2 border">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No campaigns available for this date.</p>
      )}
    </div>
  );
}
