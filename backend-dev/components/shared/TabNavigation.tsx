import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full mb-4">
      <TabsList className="grid w-full grid-cols-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
