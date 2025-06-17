import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TabsLayout from '@/layouts/tabs';
import { Download, Upload } from 'lucide-react';

const SecuritySettings = () => {
  return (
    <TabsLayout
      header={{
        title: 'Security Settings',
        description: 'Manage your security settings',
        linkBackward: '/settings',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="biometric" className="text-sm font-medium">
            Biometric Authentication
          </Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Use fingerprint or face ID</p>
        </div>
        <Switch id="biometric" checked={false} onCheckedChange={() => {}} />
      </div>
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Upload className="mr-2 h-4 w-4" />
          Import Data
        </Button>
      </div>
    </TabsLayout>
  );
};

export default SecuritySettings;
