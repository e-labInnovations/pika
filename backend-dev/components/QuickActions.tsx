import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  action: () => void;
  href?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className = '' }) => {
  const handleAction = (action: QuickAction) => {
    if (action.href) {
      window.location.href = action.href;
    } else {
      action.action();
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Common administrative tasks</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className="group p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                  <div className={cn("p-2 rounded-lg bg-opacity-10 group-hover:bg-opacity-20 transition-colors", action.iconColor.replace('text-', 'bg-'))}>
                    {action.icon}
                  </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-500 transition-colors">
                    {action.description}
                  </p>
                </div>
                
                <ArrowRight 
                  className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" 
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
