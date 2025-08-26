import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

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
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Common administrative tasks</p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Card
              key={action.id}
              onClick={() => handleAction(action)}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-primary/50 hover:bg-muted/50 p-4"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className={cn("p-2 rounded-lg bg-opacity-10 group-hover:bg-opacity-20 transition-colors", action.iconColor.replace('text-', 'bg-'))}>
                  {action.icon}
                </div>
              
                <div className="flex-1 text-left">
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
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
