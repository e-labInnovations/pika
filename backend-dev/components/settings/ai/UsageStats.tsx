import React, { useEffect, useState } from 'react';
import { BarChart3, Key, Activity, Users, Zap, TrendingUp, Loader2 } from 'lucide-react';
import AdminCard from '../../AdminCard';
import apiFetch from '@wordpress/api-fetch';

interface UsageStatsProps {
  onStatsChange?: (stats: any) => void;
}

interface AIUsageStats {
  totalApiCalls: number;
  monthlyApiCalls: number;
  totalTokens: number;
  monthlyTokens: number;
  uniqueUsers: number;
  apiKeyStatus: string;
  aiFeaturesEnabled: boolean;
  monthlyCost: number;
  recentUsage: Array<{
    date: string;
    calls: number;
    tokens: number;
    users: number;
  }>;
}

const UsageStats: React.FC<UsageStatsProps> = ({ onStatsChange }) => {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load usage statistics on component mount
  useEffect(() => {
    loadUsageStats();
  }, []);

  // Load usage statistics from backend
  const loadUsageStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFetch({ 
        path: '/pika/v1/admin/ai-usage-stats',
        method: 'GET'
      }) as any;
      
      if (response && response.success && response.data) {
        setStats(response.data);
        // Notify parent component of stats change
        if (onStatsChange) {
          onStatsChange(response.data);
        }
      } else {
        setError('Failed to load usage statistics');
      }
    } catch (err: any) {
      console.error('Failed to load usage statistics:', err);
      setError(err.message || 'Failed to load usage statistics');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh statistics
  const refreshStats = () => {
    loadUsageStats();
  };

  if (isLoading) {
    return (
      <AdminCard title="AI Usage Statistics" subtitle="Monitor your AI API usage and costs">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-gray-500">Loading usage statistics...</p>
        </div>
      </AdminCard>
    );
  }

  if (error || !stats) {
    return (
      <AdminCard title="AI Usage Statistics" subtitle="Monitor your AI API usage and costs">
        <div className="text-center py-8">
          <div className="text-red-500 mb-3">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Failed to load statistics</p>
          </div>
          <p className="text-gray-500 mb-4">{error || 'Unknown error occurred'}</p>
          <button
            onClick={refreshStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard title="AI Usage Statistics" subtitle="Monitor your AI API usage and costs">
      <div className="space-y-6">
        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total API Calls */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Total API Calls</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalApiCalls.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600 font-medium">This Month</p>
                <p className="text-sm font-semibold text-blue-700">{stats.monthlyApiCalls.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* API Key Status */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">API Key Status</p>
                <p className="text-lg font-bold text-green-600">{stats.apiKeyStatus}</p>
                <p className="text-xs text-green-600">
                  {stats.aiFeaturesEnabled ? 'Features Enabled' : 'Features Disabled'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Cost */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-purple-900">Monthly Cost</p>
                <p className="text-2xl font-bold text-purple-600">${stats.monthlyCost.toFixed(6)}</p>
                <p className="text-xs text-purple-600">
                  {stats.monthlyTokens.toLocaleString()} tokens
                </p>
              </div>
            </div>
          </div>

          {/* Unique Users */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-orange-900">Active Users</p>
                <p className="text-2xl font-bold text-orange-600">{stats.uniqueUsers.toLocaleString()}</p>
                <p className="text-xs text-orange-600">Using AI features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Summary */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-yellow-600" />
              Token Usage Summary
            </h4>
            <button
              onClick={refreshStats}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-lg font-semibold text-gray-900">
                {stats.totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Tokens (All Time)</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-lg font-semibold text-gray-900">
                {stats.monthlyTokens.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Tokens (This Month)</div>
            </div>
          </div>
        </div>

        {/* Recent Usage (Last 7 Days) */}
        {stats.recentUsage && stats.recentUsage.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Recent Usage (Last 7 Days)
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Calls</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentUsage.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.calls.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.tokens.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {day.users.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminCard>
  );
};

export default UsageStats;
