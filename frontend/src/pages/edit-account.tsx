import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { accounts, type Account } from '@/data/dummy-data';
import { type IconName } from '@/components/ui/icon-picker';
import { AccountFormFields, AccountIconSelector, AccountPreview } from '@/components/accounts-settings';

const EditAccount = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'wallet' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
    avatar: '',
  });

  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (accountId) {
      // Find the account in the accounts array
      const foundAccount = accounts.find((account) => account.id === accountId);
      if (foundAccount) {
        setAccount(foundAccount);
        setFormData({
          name: foundAccount.name,
          description: foundAccount.description || '',
          icon: foundAccount.icon as IconName,
          bgColor: foundAccount.bgColor,
          color: foundAccount.color,
          avatar: foundAccount.avatar || '',
        });
      }
    }
  }, [accountId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement account update logic
    console.log('Updating account:', { ...formData, id: accountId });
    navigate('/settings/accounts');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
      // TODO: Implement account deletion logic
      console.log('Deleting account:', accountId);
      navigate('/settings/accounts');
    }
  };

  if (!account) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Account',
          description: 'Account not found',
          linkBackward: '/settings/accounts',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Account not found</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: 'Edit Account',
        description: 'Update account information',
        linkBackward: '/settings/accounts',
      }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AccountFormFields
                name={formData.name}
                description={formData.description}
                onNameChange={(name) => setFormData((prev) => ({ ...prev, name }))}
                onDescriptionChange={(description) => setFormData((prev) => ({ ...prev, description }))}
              />

              <AccountIconSelector
                name={formData.name}
                icon={formData.icon}
                bgColor={formData.bgColor}
                color={formData.color}
                avatar={formData.avatar}
                onIconChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
                onBgColorChange={(bgColor) => setFormData((prev) => ({ ...prev, bgColor }))}
                onColorChange={(color) => setFormData((prev) => ({ ...prev, color }))}
                onAvatarChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))}
              />

              <AccountPreview
                name={formData.name}
                description={formData.description}
                icon={formData.icon}
                bgColor={formData.bgColor}
                color={formData.color}
                avatar={formData.avatar}
                balance={account.balance}
                useAvatar={!!formData.avatar}
              />
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button variant="destructive" onClick={handleDelete} className="w-1/2">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()} className="w-1/2">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </TabsLayout>
  );
};

export default EditAccount;
