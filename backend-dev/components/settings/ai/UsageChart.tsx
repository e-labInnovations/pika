import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, AreaChart, Area, Legend } from 'recharts';
import { BarChart3, TrendingUp, Clock, Zap, Loader2, RefreshCw, Calendar } from 'lucide-react';
import apiFetch from '@wordpress/api-fetch';

interface UsageChartProps {
  onChartDataChange?: (data: any) => void;
}

interface ChartData {
  daily_usage: Array<{
    date: string;
    formatted_date: string;
    total_calls: number;
    total_tokens: number;
    unique_users: number;
    text_calls: number;
    image_calls: number;
    text_tokens: number;
    image_tokens: number;
    avg_latency: number;
    success_rate: number;
    cost: number;
  }>;
  model_breakdown: Array<{
    model: string;
    call_count: number;
    total_tokens: number;
    avg_latency: number;
    percentage: number;
  }>;
  hourly_pattern: Array<{
    hour: number;
    formatted_hour: string;
    call_count: number;
    total_tokens: number;
  }>;
  summary: {
    total_calls: number;
    total_tokens: number;
    avg_daily_calls: number;
    avg_daily_tokens: number;
    total_cost: number;
    period_days: number;
  };
}

const UsageChart: React.FC<UsageChartProps> = ({ onChartDataChange }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('daily');

  // Load chart data on component mount and when period changes
  useEffect(() => {
    loadChartData();
  }, [selectedPeriod]);

  // Load chart data from backend
  const loadChartData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch({ 
        path: `/pika/v1/admin/ai-usage-chart?days=${selectedPeriod}`,
        method: 'GET'
      }) as any;
      
      if (response && response.success && response.data) {
        setChartData(response.data);
        // Notify parent component of chart data change
        if (onChartDataChange) {
          onChartDataChange(response.data);
        }
      } else {
        setError('Failed to load chart data');
      }
    } catch (err: any) {
      console.error('Failed to load chart data:', err);
      setError(err.message || 'Failed to load chart data');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh chart data
  const refreshChartData = () => {
    loadChartData();
  };

  // Color mapping for different types
  const getBarColor = (type: string) => {
    return type === 'TEXT' ? '#3B82F6' : '#10B981';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-8">
          <div className="text-red-500 mb-3">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Failed to load chart data</p>
          </div>
          <p className="text-gray-500 mb-4">{error || 'Unknown error occurred'}</p>
          <button
            onClick={refreshChartData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
            AI Usage Analytics
          </h4>
          <p className="text-sm text-gray-500">Comprehensive usage statistics and trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={60}>Last 60 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
          <button
            onClick={refreshChartData}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-lg font-semibold text-blue-600">
            {chartData.summary.total_calls.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600">Total Calls</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="text-lg font-semibold text-green-600">
            {chartData.summary.total_tokens.toLocaleString()}
          </div>
          <div className="text-xs text-green-600">Total Tokens</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-lg font-semibold text-purple-600">
            ${chartData.summary.total_cost.toFixed(6)}
          </div>
          <div className="text-xs text-purple-600">Total Cost</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
          <div className="text-lg font-semibold text-orange-600">
            {chartData.summary.avg_daily_calls.toFixed(1)}
          </div>
          <div className="text-xs text-orange-600">Avg Daily Calls</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'daily', label: 'Daily Usage', icon: Calendar },
            { id: 'hourly', label: 'Hourly Pattern', icon: Clock },
            { id: 'models', label: 'Model Breakdown', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Daily Usage Chart */}
        {activeTab === 'daily' && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-4">Daily Usage Trends</h5>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData.daily_usage}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="formatted_date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    yAxisId="left"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    yAxisId="right"
                    orientation="right"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  <Area
                    type="monotone"
                    dataKey="total_tokens"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorTokens)"
                    yAxisId="left"
                    name="Total Tokens"
                  />
                  <Area
                    type="monotone"
                    dataKey="total_calls"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#colorCalls)"
                    yAxisId="right"
                    name="Total Calls"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Hourly Pattern Chart */}
        {activeTab === 'hourly' && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-4">Hourly Usage Pattern (Last 7 Days)</h5>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData.hourly_pattern}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="formatted_hour" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  
                  <Bar 
                    dataKey="call_count" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="API Calls"
                  />
                  <Bar 
                    dataKey="total_tokens" 
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    name="Total Tokens"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Model Breakdown Chart */}
        {activeTab === 'models' && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-4">Model Usage Breakdown</h5>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.model_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ model, percentage }) => `${model}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="call_count"
                      nameKey="model"
                    >
                      {chartData.model_breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Model Details Table */}
              <div className="space-y-3">
                <h6 className="text-sm font-medium text-gray-900">Model Performance</h6>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {chartData.model_breakdown.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{model.model}</p>
                        <p className="text-xs text-gray-500">{model.call_count.toLocaleString()} calls</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-600">{model.percentage}%</p>
                        <p className="text-xs text-gray-500">{model.total_tokens.toLocaleString()} tokens</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-4">Additional Metrics</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {chartData.daily_usage.length > 0 ? 
                Math.round(chartData.daily_usage.reduce((sum, day) => sum + day.success_rate, 0) / chartData.daily_usage.length) : 0
              }%
            </div>
            <div className="text-xs text-gray-500">Avg Success Rate</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {chartData.daily_usage.length > 0 ? 
                Math.round(chartData.daily_usage.reduce((sum, day) => sum + day.avg_latency, 0) / chartData.daily_usage.length) : 0
              }ms
            </div>
            <div className="text-xs text-gray-500">Avg Response Time</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {chartData.daily_usage.length > 0 ? 
                Math.round(chartData.daily_usage.reduce((sum, day) => sum + day.unique_users, 0) / chartData.daily_usage.length) : 0
              }
            </div>
            <div className="text-xs text-gray-500">Avg Daily Users</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;
