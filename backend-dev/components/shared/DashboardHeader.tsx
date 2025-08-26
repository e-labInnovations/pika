import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  onRefresh?: () => void;
  onAddNew?: () => void;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  onRefresh,
  onAddNew,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", className)}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
        
        {onAddNew && (
          <Button
            onClick={onAddNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
