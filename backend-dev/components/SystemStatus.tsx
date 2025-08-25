import React from 'react';
import { Check, Database, Shield, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface SystemStatusProps {
  databaseSize: number;
  systemHealth: string;
  geminiApiCost: number;
  lastBackup: string;
  className?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ databaseSize, systemHealth, geminiApiCost, lastBackup, className = '' }) => {
  const formattedDatabaseSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    if (bytes === 0) return '0 B';
    return (bytes / Math.pow(1024, index)).toFixed(2) + ' ' + units[index];
  };
  
  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200 p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        <p className="text-sm text-gray-600 mt-1">Plugin and infrastructure health</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Plugin Status</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Active
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Database</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            {systemHealth}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Last Backup</span>
          </div>
          <span className="text-sm text-gray-900">{lastBackup}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Database Size</span>
          </div>
          <span className="text-sm text-gray-900">{formattedDatabaseSize(databaseSize)}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
