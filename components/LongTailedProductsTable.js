export default function LongTailedProductsTable({ dailyData }) {
  const tableRows = dailyData
    .filter(row => (parseFloat(row.GMV) || 0) < 100000) // Only GMV < 100,000
    .map(row => {
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
      <h2>Long-tailed Products (GMV < ₹100,000)</h2>
      {tableRows.length > 0 ? (
        <div className="table-wrapper">
          <table className="campaign-table">
            <thead>
              <tr>
                {tableRows.length > 0 && Object.keys(tableRows[0]).map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => {
                const roas = row.ROAS;
                let rowStyle = {};
                if (roas < 5) {
                  rowStyle = { backgroundColor: '#ffcccc' }; // Light red for ROAS < 5
                } else if (roas > 10) {
                  rowStyle = { backgroundColor: '#ccffcc' }; // Light green for ROAS > 10
                }
                return (
                  <tr key={index} style={rowStyle}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No long-tailed products available for this date.</p>
      )}
    </div>
  );
}
