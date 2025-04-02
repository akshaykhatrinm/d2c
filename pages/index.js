import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import DateSelector from '../components/DateSelector';
import MetricsBlocks from '../components/MetricsBlocks';
import PieChart from '../components/PieChart';
import CampaignTable from '../components/CampaignTable';
import GeminiSummary from '../components/GeminiSummary';
import Papa from 'papaparse';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.auth !== 'true') {
      window.location.href = '/login';
    }
  }, []);

  // Fetch and process marketing data client-side
  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.NEXT_PUBLIC_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSCpVm8J-Om7tZw1pJXJOeXjLgheQbE8I80vWuY0VldkOw105c5S39eCFpEoJrnByH65RQald3wd-y1/pub?gid=0&single=true&output=csv';
      try {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        const csvText = await response.text();
        console.log('Raw CSV response:', csvText.substring(0, 200));

        const { data } = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: 'greedy', // Skips completely empty rows
          dynamicTyping: true,
          transform: (value, header) => {
            if (header === 'GMV') return parseFloat(value.replace(/,/g, '') || 0); // Empty GMV = 0
            if (header === 'PP%') return parseFloat(value.replace('%', '') || 0);
            return value;
          },
        });

        // Filter out rows where Title is only numbers
        const filteredData = data.filter(row => {
          const title = row.Title?.toString() || '';
          return !/^\d+(\.\d+)?$/.test(title); // Remove if Title is purely numeric
        });

        if (!filteredData.length) throw new Error('No valid data parsed from CSV');
        console.log('Parsed and filtered data:', filteredData);
        setData(filteredData);

        const uniqueDates = [...new Set(filteredData.map(row => row.Date))].sort();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const defaultDate = uniqueDates.includes(yesterdayStr) ? yesterdayStr : uniqueDates[uniqueDates.length - 1];
        setSelectedDate(defaultDate);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Gemini analysis
  useEffect(() => {
    if (selectedDate) {
      const fetchAnalysis = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nexxbase-dashboard.vercel.app';
        const apiUrl = `${baseUrl}/api/getGeminiAnalysis?date=${selectedDate}`;
        try {
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error(`Failed to fetch analysis: ${res.statusText}`);
          const { analysis } = await res.json();
          setAnalysis(analysis);
        } catch (error) {
          console.error('Analysis fetch error:', error);
          setAnalysis('Failed to load analysis: ' + error.message);
        }
      };
      fetchAnalysis();
    }
  }, [selectedDate]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  const dailyData = data.filter(row => row.Date === selectedDate);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Nexxbase Marketing Dashboard</h1>
      {data.length ? (
        <>
          <DateSelector dates={[...new Set(data.map(row => row.Date))]} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <GeminiSummary analysis={analysis} />
          <MetricsBlocks dailyData={dailyData} />
          <PieChart dailyData={dailyData} />
          <CampaignTable dailyData={dailyData.filter(row => row.GMV >= 100000)} /> {/* Filter GMV < 100000 */}
        </>
      ) : (
        <p className="text-center text-red-500">No data available to display.</p>
      )}
    </div>
  );
}
