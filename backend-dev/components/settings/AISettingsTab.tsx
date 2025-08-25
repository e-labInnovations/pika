import React, { useState } from 'react';
import ApiKeyConfig from './ai/ApiKeyConfig';
import UsageStats from './ai/UsageStats';
import UsageChart from './ai/UsageChart';

const AISettingsTab = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle settings change from ApiKeyConfig
  const handleSettingsChange = (settings: { apiKey: string; isEnabled: boolean }) => {
    // You can use this to update other components or perform additional actions
    // console.log('AI Settings changed:', settings);
  };

  // Handle stats change from UsageStats
  const handleStatsChange = (stats: any) => {
    // You can use this to update other components or perform additional actions
    // console.log('Usage stats updated:', stats);
  };

  // Handle chart data change from UsageChart
  const handleChartDataChange = (chartData: any) => {
    // You can use this to update other components or perform additional actions
    // console.log('Chart data updated:', chartData);
  };

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* API Key Configuration */}
      <ApiKeyConfig onSettingsChange={handleSettingsChange} />

      {/* Usage Statistics */}
      <UsageStats onStatsChange={handleStatsChange} />

      {/* Usage Chart */}
      <UsageChart onChartDataChange={handleChartDataChange} />
    </div>
  );
};

export default AISettingsTab;
