export default function CampaignTable({ dailyData }) {
  const tableRows = dailyData.map(row => {
    const spend = Math.round(parseFloat(row['Spents Total']) || 0);
    const gmv = Math.round(parseFloat(row.GMV) || 0);
    const units = parseInt(row.Units) || 0;
    const asp = units ? Math.round(gmv / units) : 0;
    const cac = units ? Math.round(spend / units) : 0;
    const roas = spend ? Math.round(gmv / spend) : 0;
    const pp = Math.round(parseFloat(row['PP%']) || 0);

    return {
      'Campaign Name': row['PowerBI Name'] || 'Unknown',
      'Spend (₹)': spend,
      'GMV (₹)': gmv,
      'Units Sold': units,
      ASP: asp,
      CAC: cac,
      ROAS: roas,
      'PP%': pp,
    };
  });

  return (
    <div className="campaign-table-container">
      <h2>Campaign Performance</h2>
      {tableRows.length > 0 ? (
        <div className="table-wrapper">
          <table className="campaign-table">
            <thead>
              <tr>
                {Object.keys(tableRows[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
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
