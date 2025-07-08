import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TabsLayout from '@/layouts/tabs';
import { useTheme } from '@/provider/theme-provider';
import { settingsService, type Settings, aiService } from '@/services/api';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router';
import ApiInput from '@/components/api-input';
import { runWithLoaderAndError } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setIsLoading(true);
    setError(null);
    settingsService
      .getSettings()
      .then((res) => {
        setSettings(res.data);
        setGeminiApiKey(res.data.gemini_api_key || '');
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Debounced update for Gemini API key
  useEffect(() => {
    if (!settings) return;
    if (geminiApiKey === settings.gemini_api_key) return;

    const handler = setTimeout(() => {
      runWithLoaderAndError(
        async () => {
          await settingsService.updateSettingsItem('gemini_api_key', geminiApiKey);
          fetchSettings();
        },
        {
          loaderMessage: 'Updating Gemini API key...',
          successMessage: 'Gemini API key updated successfully',
        },
      );
    }, 2000);

    return () => clearTimeout(handler);
  }, [geminiApiKey, settings]);

  const handleTestGemini = () => {
    runWithLoaderAndError(
      async () => {
        const res = await aiService.analyzeText(
          'I spent 1000 on food at the mall from my wallet on 2025-07-07 10:00:00 pm',
        );
        console.log(res.data);
      },
      {
        loaderMessage: 'Testing Gemini...',
        successMessage: 'Gemini tested successfully',
      },
    );
  };

  return (
    <TabsLayout
      header={{
        title: 'General Settings',
        description: 'Manage your general settings',
        linkBackward: '/settings',
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">General Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure your general settings</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Dark Mode
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </div>
          <div className="pointer-events-none flex items-center justify-between opacity-50">
            <div>
              <Label htmlFor="auto-backup" className="text-sm font-medium">
                Auto Backup
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automatically backup your data</p>
            </div>
            <Switch id="auto-backup" checked={false} onCheckedChange={() => {}} />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">AI Settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure your AI settings</p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="gemini-api-key" className="text-sm font-medium">
                Gemini API Key
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your Gemini API key. You can get it from{' '}
                <Link
                  className="text-blue-500 hover:underline"
                  to="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </Link>
                .
              </p>
            </div>
            <ApiInput
              id="gemini-api-key"
              value={geminiApiKey}
              onChange={setGeminiApiKey}
              placeholder="Enter your Gemini API key"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="test-gemini" className="text-sm font-medium">
                Test Gemini
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Test your Gemini API key</p>
            </div>
            <Button id="test-gemini" onClick={handleTestGemini}>
              Test
            </Button>
          </div>
        </div>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default GeneralSettings;
