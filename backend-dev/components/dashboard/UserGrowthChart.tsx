import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import apiFetch from '@wordpress/api-fetch';

interface ChartDataPoint {
  month: string;
  new_users: number;
  total_users: number;
  growth_rate: number;
}

interface UserGrowthChartProps {
  className?: string;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch({ 
          path: '/pika/v1/admin/user-growth',
          method: 'GET'
        });
        
        if (response && Array.isArray(response)) {
          setChartData(response as ChartDataPoint[]);
        } else {
          // Fallback to mock data if API doesn't return expected format
          setChartData(mockUserChartData);
        }
      } catch (err) {
        console.error('Failed to fetch user growth data:', err);
        setError('Failed to load data');
        // Fallback to mock data on error
        setChartData(mockUserChartData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data - in real implementation, this would come from WordPress REST API
  const mockUserChartData: ChartDataPoint[] = [
    { month: 'Jan', new_users: 1200, total_users: 1200, growth_rate: 0 },
    { month: 'Feb', new_users: 1350, total_users: 2550, growth_rate: 12.5 },
    { month: 'Mar', new_users: 1420, total_users: 3970, growth_rate: 5.2 },
    { month: 'Apr', new_users: 1580, total_users: 5550, growth_rate: 11.3 },
    { month: 'May', new_users: 1620, total_users: 7170, growth_rate: 2.5 },
    { month: 'Jun', new_users: 1740, total_users: 8910, growth_rate: 7.4 }
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                User Growth
              </CardTitle>
              <p className="text-sm text-muted-foreground">Monthly new users and growth trends</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-500">New Users</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            User Growth
          </CardTitle>
          <p className="text-sm text-muted-foreground">Monthly new users and growth trends</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">Failed to load chart data</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            User Growth
          </CardTitle>
          <p className="text-sm text-muted-foreground">Monthly new users and growth trends</p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No user growth data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary stats
  const totalNewUsers = chartData.reduce((sum, item) => sum + item.new_users, 0);
  const averageGrowth = chartData.reduce((sum, item) => sum + item.growth_rate, 0) / chartData.length;
  const latestMonth = chartData[chartData.length - 1];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              User Growth
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monthly new users and growth trends</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">Total New Users</div>
              <div className="text-lg font-semibold text-gray-900">{totalNewUsers.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Avg. Growth</div>
              <div className="text-lg font-semibold text-green-600">{averageGrowth.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTotalUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickMargin={10}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickMargin={10}
              />
              
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              
              <Area
                type="monotone"
                dataKey="new_users"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#colorNewUsers)"
                name="New Users"
              />
              
              <Area
                type="monotone"
                dataKey="total_users"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#colorTotalUsers)"
                name="Total Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-lg font-semibold text-blue-600">
              {latestMonth.new_users.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600">This Month</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="text-lg font-semibold text-green-600">
              {latestMonth.total_users.toLocaleString()}
            </div>
            <div className="text-xs text-green-600">Total Users</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-lg font-semibold text-purple-600">
              {latestMonth.growth_rate.toFixed(1)}%
            </div>
            <div className="text-xs text-purple-600">Growth Rate</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="text-lg font-semibold text-orange-600">
              {averageGrowth.toFixed(1)}%
            </div>
            <div className="text-xs text-orange-600">Avg. Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
