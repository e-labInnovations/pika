import React from 'react';
import { Database, DollarSign, Activity, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ApiUsageCardProps {
  geminiApiCalls: number;
  geminiApiCost: number;
  pushNotificationsSent: number;
  className?: string;
}

const ApiUsageCard: React.FC<ApiUsageCardProps> = ({ 
  geminiApiCalls, 
  geminiApiCost, 
  pushNotificationsSent, 
  className = '' 
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">API Usage & Costs</h3>
        <p className="text-sm text-gray-600 mt-1">Gemini API consumption and billing</p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Database className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600">Monthly API Calls</span>
          </div>
          <span className="font-medium text-gray-900">{geminiApiCalls.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600">Monthly Cost</span>
          </div>
          <span className="font-medium text-gray-900">${geminiApiCost}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600">Rate Limit</span>
          </div>
          <span className="font-medium text-green-600">80% used</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Bell className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600">Push Notifications</span>
          </div>
          <span className="font-medium text-gray-900">{pushNotificationsSent.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageCard;
