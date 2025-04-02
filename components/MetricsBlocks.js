export default function MetricsBlocks({ dailyData }) {
  const totalSpend = dailyData.reduce((sum, row) => sum + parseFloat(row['Spents Total'] || 0), 0);
  const totalGMV = dailyData.reduce((sum, row) => sum + parseFloat(row.GMV || 0), 0);
  const totalUnits = dailyData.reduce((sum, row) => sum + parseInt(row.Units || 0), 0);
  const asp = totalUnits ? totalGMV / totalUnits : 0;
  const cac = totalUnits ? totalSpend / totalUnits : 0; // Using Units as Orders

  const metrics = [
    { label: 'Units Sold', value: totalUnits },
    { label: 'ASP (₹)', value: asp.toFixed(2) },
    { label: 'CAC (₹)', value: cac.toFixed(2) },
    { label: 'GMV (₹)', value: totalGMV.toFixed(2) },
    { label: 'Total Spend (₹)', value: totalSpend.toFixed(2) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {metrics.map(metric => (
        <div key={metric.label} className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-medium">{metric.label}</h3>
          <p className="text-2xl font-bold">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
