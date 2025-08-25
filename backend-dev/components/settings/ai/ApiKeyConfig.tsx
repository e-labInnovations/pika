import React, { useEffect, useState } from 'react';
import { Key, Save, Loader2, EyeOff, Eye } from 'lucide-react';
import AdminCard from '../../AdminCard';
import apiFetch from '@wordpress/api-fetch';

interface ApiKeyConfigProps {
  onSettingsChange?: (settings: { apiKey: string; isEnabled: boolean }) => void;
}

interface AISettings {
  api_key: string;
  is_enabled: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: AISettings;
  message?: string;
  error?: string;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onSettingsChange }) => {
  const [aiSettings, setAiSettings] = useState<AISettings>({
    api_key: '',
    is_enabled: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  // Load AI settings on component mount
  useEffect(() => {
    loadAISettings();
  }, []);

  // Load AI settings from backend
  const loadAISettings = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await apiFetch({ 
        path: '/pika/v1/admin/ai-settings',
        method: 'GET'
      }) as ApiResponse;
      
      if (response && response.success && response.data) {
        setAiSettings(response.data);
        // Notify parent component of settings change
        if (onSettingsChange) {
          onSettingsChange({
            apiKey: response.data.api_key,
            isEnabled: response.data.is_enabled
          });
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to load AI settings' });
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      setMessage({ type: 'error', text: 'Failed to load AI settings' });
    } finally {
      setIsLoading(false);
    }
  };

  // Save AI settings to backend
  const saveAISettings = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      const response = await apiFetch({ 
        path: '/pika/v1/admin/ai-settings',
        method: 'POST',
        data: {
          api_key: aiSettings.api_key,
          is_enabled: aiSettings.is_enabled
        }
      }) as ApiResponse;
      
      if (response && response.success) {
        setMessage({ type: 'success', text: response.message || 'AI settings saved successfully!' });
        
        // Notify parent component of settings change
        if (onSettingsChange) {
          onSettingsChange({
            apiKey: aiSettings.api_key,
            isEnabled: aiSettings.is_enabled
          });
        }
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to save AI settings' });
      }
    } catch (error: any) {
      console.error('Failed to save AI settings:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save AI settings' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle API key change
  const handleApiKeyChange = (key: string) => {
    setAiSettings(prev => ({ ...prev, api_key: key }));
  };

  // Handle enabled status change
  const handleEnabledChange = (enabled: boolean) => {
    setAiSettings(prev => ({ ...prev, is_enabled: enabled }));
  };

  // Clear API key
  const clearApiKey = () => {
    handleApiKeyChange('');
  };

  // Refresh settings
  const refreshSettings = () => {
    loadAISettings();
  };

  return (
    <AdminCard title="Gemini API Configuration" subtitle="Set up your Gemini API key for AI features">
      <div className="space-y-4">
        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API Key
          </label>
          <div className="flex space-x-2">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={aiSettings.api_key}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key"
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              disabled={isLoading || isSaving}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              onClick={clearApiKey}
              disabled={isLoading || isSaving}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Google AI Studio
            </a>
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="ai_enabled"
            checked={aiSettings.is_enabled}
            onChange={(e) => handleEnabledChange(e.target.checked)}
            disabled={isLoading || isSaving}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="ai_enabled" className="ml-2 block text-sm text-gray-900">
            Enable AI features
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={saveAISettings}
            disabled={isSaving || isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save AI Settings
              </>
            )}
          </button>

          <button
            onClick={refreshSettings}
            disabled={isLoading || isSaving}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 mx-auto text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500 mt-2">Loading AI settings...</p>
          </div>
        )}
      </div>
    </AdminCard>
  );
};

export default ApiKeyConfig;
