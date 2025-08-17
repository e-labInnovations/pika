import React from 'react';

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
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 mb-4">
          {subtitle}
        </p>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default AdminCard;
