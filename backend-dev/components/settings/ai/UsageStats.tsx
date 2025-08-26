import React, { useEffect, useState } from 'react';
import { BarChart3, Key, Activity, Users, Zap, TrendingUp, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import AdminCard from '../../AdminCard';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
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
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">Loading Statistics</h3>
          <p className="text-gray-500">Please wait while we fetch your AI usage data...</p>
        </div>
      </AdminCard>
    );
  }

  if (error || !stats) {
    return (
      <AdminCard title="AI Usage Statistics" subtitle="Monitor your AI API usage and costs">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mb-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">Failed to Load Statistics</h3>
          <p className="text-gray-500 mb-4">{error || 'Unknown error occurred'}</p>
          <Button onClick={refreshStats} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard title="AI Usage Statistics" subtitle="Monitor your AI API usage and costs">
      <div className="space-y-6">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Usage Overview</h3>
              <p className="text-sm text-gray-500">Real-time AI API consumption metrics</p>
            </div>
          </div>
          <Button onClick={refreshStats} variant="outline" size="sm" className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total API Calls */}
          <Card className="group hover:shadow-lg p-2 transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-xs">Monthly</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">{stats.totalApiCalls.toLocaleString()}</p>
                <p className="text-sm font-medium text-blue-600">Total API Calls</p>
                <p className="text-xs text-gray-500">
                  {stats.monthlyApiCalls.toLocaleString()} this month
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Key Status */}
          <Card className="group hover:shadow-lg p-2 transition-all duration-300 border-l-4 border-l-green-500">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Key className="h-5 w-5 text-green-600" />
                </div>
                <Badge 
                  variant={stats.aiFeaturesEnabled ? "default" : "destructive"} 
                  className="text-xs"
                >
                  {stats.aiFeaturesEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{stats.apiKeyStatus}</p>
                <p className="text-sm font-medium text-green-600">API Key Status</p>
                <p className="text-xs text-gray-500">
                  {stats.aiFeaturesEnabled ? 'All features enabled' : 'Features disabled'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Cost */}
          <Card className="group hover:shadow-lg p-2 transition-all duration-300 border-l-4 border-l-purple-500">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <Badge variant="outline" className="text-xs">Cost</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">${stats.monthlyCost.toFixed(6)}</p>
                <p className="text-sm font-medium text-purple-600">Monthly Cost</p>
                <p className="text-xs text-gray-500">
                  {stats.monthlyTokens.toLocaleString()} tokens consumed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Unique Users */}
            <Card className="group hover:shadow-lg p-2 transition-all duration-300 border-l-4 border-l-orange-500">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">{stats.uniqueUsers.toLocaleString()}</p>
                <p className="text-sm font-medium text-orange-600">Active Users</p>
                <p className="text-xs text-gray-500">Using AI features this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Token Usage Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 p-2">
          <CardContent className="p-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Token Usage Summary</h4>
                  <p className="text-sm text-gray-600">Comprehensive token consumption overview</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats.totalTokens.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Total Tokens</div>
                  <div className="text-xs text-gray-500">All time consumption</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats.monthlyTokens.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Monthly Tokens</div>
                  <div className="text-xs text-gray-500">This month's consumption</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Usage Table */}
        {stats.recentUsage && stats.recentUsage.length > 0 && (
            <Card className="p-2">
            <CardContent className="p-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">Recent Usage</h4>
                  <p className="text-sm text-gray-500">Last 7 days activity breakdown</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Calls</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens Used</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Users</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentUsage.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Badge variant="outline" className="font-mono">
                            {day.calls.toLocaleString()}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Badge variant="secondary" className="font-mono">
                            {day.tokens.toLocaleString()}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <Badge variant="default" className="font-mono">
                            {day.users.toLocaleString()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminCard>
  );
};

export default UsageStats;

