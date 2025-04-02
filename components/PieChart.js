import { PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

export default function PieChart({ dailyData }) {
  const fbSpend = dailyData.reduce((sum, row) => sum + parseFloat(row['FB Spent'] || 0), 0);
  const gaSpend = dailyData.reduce((sum, row) => sum + parseFloat(row['GA Spent'] || 0), 0);
  const otherSpend = dailyData.reduce((sum, row) => sum + parseFloat(row['OtherSpent'] || 0), 0);
  const pieData = [
    { name: 'Facebook', value: fbSpend },
    { name: 'Google', value: gaSpend },
    { name: 'Others', value: otherSpend },
  ].filter(item => item.value > 0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Overall Channel Spend Ratio</h2>
      {pieData.length > 0 ? (
        <RechartsPieChart width={400} height={400} className="mx-auto">
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </RechartsPieChart>
      ) : (
        <p>No spend data available.</p>
      )}
    </div>
  );
}
