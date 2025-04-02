import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import DateSelector from '../components/DateSelector';
import MetricsBlocks from '../components/MetricsBlocks';
import PieChart from '../components/PieChart';
import CampaignTable from '../components/CampaignTable';
import GeminiSummary from '../components/GeminiSummary';
import '../styles/Dashboard.css';
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
            if (header === 'GM
