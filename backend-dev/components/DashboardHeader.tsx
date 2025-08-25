import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className = '' }) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pika Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System overview, user management, and API monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button disabled className="inline-flex disabled:opacity-50 items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button disabled className="inline-flex disabled:opacity-50 items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
