import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import TabsLayout from '@/layouts/tabs';

const NotificationsSettings = () => {
  return (
    <TabsLayout
      header={{
        title: 'Notifications Settings',
        description: 'Manage your notifications settings',
        linkBackward: '/settings',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="notifications" className="text-sm font-medium">
            Push Notifications
          </Label>
          <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications for transactions</p>
        </div>
        <Switch id="notifications" checked={false} onCheckedChange={() => {}} />
      </div>
    </TabsLayout>
  );
};

export default NotificationsSettings;
