import TabsLayout from "@/layouts/tabs";

const SettingsTab = () => {
  return (
    <TabsLayout
      header={{
        title: "Settings",
        description: "Manage your settings",
      }}
    >
      settings
    </TabsLayout>
  );
};

export default SettingsTab;
