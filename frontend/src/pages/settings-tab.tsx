import AppInfo from '@/components/settings-tab/app-info';
import TabsLayout from '@/layouts/tabs';
import { settingSections } from '@/data/settings';
import SectionsItem from '@/components/settings-tab/section-item';

const SettingsTab = () => {
  return (
    <TabsLayout
      header={{
        title: 'Settings',
        description: 'Manage your settings',
      }}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {settingSections.map((section) => {
          return <SectionsItem key={section.id} section={section} />;
        })}
      </div>
      <AppInfo />
    </TabsLayout>
  );
};

export default SettingsTab;
