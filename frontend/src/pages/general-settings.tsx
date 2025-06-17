import ColorPicker from '@/components/color-picker';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TabsLayout from '@/layouts/tabs';
import { useTheme } from '@/provider/theme-provider';
import { useState } from 'react';

const GeneralSettings = () => {
  const { theme, setTheme } = useTheme();
  const [color, setColor] = useState('#FCC838');
  return (
    <TabsLayout
      header={{
        title: 'General Settings',
        description: 'Manage your general settings',
        linkBackward: '/settings',
      }}
    >
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
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="auto-backup" className="text-sm font-medium">
            Auto Backup
          </Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Automatically backup your data</p>
        </div>
        <Switch id="auto-backup" checked={false} onCheckedChange={() => {}} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="color-picker" className="text-sm font-medium">
            Color Picker (for testing)
          </Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Select a color</p>
        </div>
        <ColorPicker color={color} setColor={setColor} />
      </div>
    </TabsLayout>
  );
};

export default GeneralSettings;
