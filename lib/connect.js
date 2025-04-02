export function generatePrompt(data) {
    let prompt = "Analyze the following marketing data:\n";
    data.forEach(row => {
      prompt += `Campaign: ${row.campaign}, Impressions: ${row.impressions}, Clicks: ${row.clicks}, Date: ${row.date}\n`;
    });
    prompt += "Provide a summary of performance trends.";
    return prompt;
  }