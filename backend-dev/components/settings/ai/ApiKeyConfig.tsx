import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, Key, Loader2 } from 'lucide-react';
import AdminCard from '../../AdminCard';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import apiFetch from '@wordpress/api-fetch';
import { Switch } from '@/components/ui/switch';

interface AISettings {
  api_key: string;
  is_enabled: boolean;
}

interface ApiKeyConfigProps {
  onSettingsChange?: (settings: AISettings) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ onSettingsChange }) => {
  const [aiSettings, setAiSettings] = useState<AISettings>({
    api_key: '',
    is_enabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch({
        path: '/pika/v1/admin/ai-settings',
        method: 'GET'
      }) as any;

      if (response && response.success && response.data) {
        setAiSettings(response.data);
        if (onSettingsChange) {
          onSettingsChange(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
      setMessage('Failed to load AI settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAISettings = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      const response = await apiFetch({
        path: '/pika/v1/admin/ai-settings',
        method: 'POST',
        data: aiSettings
      }) as any;

      if (response && response.success) {
        setMessage('AI settings saved successfully!');
        if (onSettingsChange) {
          onSettingsChange(aiSettings);
        }
      } else {
        setMessage(response?.message || 'Failed to save AI settings');
      }
    } catch (error) {
      console.error('Failed to save AI settings:', error);
      setMessage('Failed to save AI settings');
    } finally {
      setIsSaving(false);
    }
  };

  const refreshSettings = () => {
    loadAISettings();
  };

  const handleApiKeyChange = (value: string) => {
    setAiSettings(prev => ({ ...prev, api_key: value }));
  };

  const handleEnabledChange = (checked: boolean) => {
    setAiSettings(prev => ({ ...prev, is_enabled: checked }));
  };

  const clearApiKey = () => {
    setAiSettings(prev => ({ ...prev, api_key: '' }));
  };

  if (isLoading) {
    return (
      <AdminCard title="AI Configuration" subtitle="Configure Gemini API settings">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto text-blue-600 animate-spin mb-3" />
          <p className="text-gray-500">Loading AI settings...</p>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard title="AI Configuration" subtitle="Configure Gemini API settings">
      <div className="space-y-6">
        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* API Key Input */}
        <div>
          <Label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API Key
          </Label>
          <div className="flex space-x-2">
            <Input
              type={showApiKey ? 'text' : 'password'}
              value={aiSettings.api_key}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => setShowApiKey(!showApiKey)}
              disabled={isLoading || isSaving}
              variant="outline"
              size="sm"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              onClick={clearApiKey}
              disabled={isLoading || isSaving}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from{' '}
            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Google AI Studio
            </a>
          </p>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="ai_enabled"
            checked={aiSettings.is_enabled}
            onCheckedChange={handleEnabledChange}
            disabled={isLoading || isSaving}
          />
          <Label htmlFor="ai_enabled" className="text-sm text-gray-900">
            Enable AI features
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={saveAISettings}
            disabled={isSaving || isLoading}
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
          </Button>

          <Button
            onClick={refreshSettings}
            disabled={isLoading || isSaving}
            variant="outline"
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
          </Button>
        </div>
      </div>
    </AdminCard>
  );
};

export default ApiKeyConfig;
