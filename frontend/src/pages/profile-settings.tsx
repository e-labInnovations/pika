import TabsLayout from '@/layouts/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProfileSettings = () => {
  return (
    <TabsLayout
      header={{
        title: 'Profile Settings',
        description: 'Manage your profile settings',
        linkBackward: '/settings',
      }}
    >
      <Card className="bg-white/50 dark:bg-slate-800/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
              <span className="text-xl font-bold text-white">🏔️</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Pika User</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">user@example.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" className="w-full">
        Edit Profile
      </Button>
    </TabsLayout>
  );
};

export default ProfileSettings;
