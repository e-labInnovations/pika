import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bot, Bell } from 'lucide-react';
import TabNavigation from '@/components/shared/TabNavigation';
import MessageDisplay from '@/components/shared/MessageDisplay';
import AISettingsTab from '@/components/settings/AISettingsTab';
import NotificationsTab from '@/components/settings/NotificationsTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('ai');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tabs = [
    { id: 'ai', label: 'AI Settings', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without react-router
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  // Get active tab from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') || 'ai';
    setActiveTab(tab);
  }, []);

  // Handle message dismissal
  const handleMessageDismiss = () => {
    setMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure AI settings and notification preferences</p>
        </div>
        <SettingsIcon className="h-8 w-8 text-gray-400" />
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Message Display */}
      <MessageDisplay 
        message={message} 
        onDismiss={handleMessageDismiss}
      />

      {/* Tab Content */}
      {activeTab === 'ai' && <AISettingsTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
    </div>
  );
};

export default Settings;