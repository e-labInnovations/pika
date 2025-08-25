import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface Stats {
  value: number;
  change: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsCardProps {
  title: string;
  stats: Stats | undefined;
  icon: React.ReactNode;
  iconColor?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  stats,
  icon,
  iconColor = 'bg-blue-600',
  className = '',
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.value.toLocaleString()}</p>
          {stats?.change && (
            <div className="flex items-center mt-2">
              {stats?.change.isPositive ? (
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={cn("text-sm font-medium", stats?.change.isPositive ? 'text-green-600' : 'text-red-600')}
              >
                {stats?.change.isPositive ? '+' : ''}
                {stats?.change.value.toFixed(2)}%
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-opacity-10", iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
