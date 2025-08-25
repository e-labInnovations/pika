import { Settings } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';

  interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AdminCard: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-6", className)}>
      {title && (
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        </div>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 mb-4">
          {subtitle}
        </p>
      )}
      <div className={cn("text-gray-700", className)}>
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
