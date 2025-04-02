import Papa from 'papaparse';

let cachedData = null;
let lastFetch = null;

export async function fetchMarketingData() {
  const now = new Date();
  if (cachedData && lastFetch && (now - lastFetch) < 24 * 60 * 60 * 1000) {
    return cachedData;
  }

  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSCpVm8J-Om7tZw1pJXJOeXjLgheQbE8I80vWuY0VldkOw105c5S39eCFpEoJrnByH65RQald3wd-y1/pub?gid=0&single=true&output=csv'; // Replace with your Google Sheet CSV URL
  const response = await fetch(csvUrl);
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      complete: (result) => {
        cachedData = result.data;
        lastFetch = now;
        resolve(result.data);
      },
      error: (error) => reject(error),
    });
  });
}
