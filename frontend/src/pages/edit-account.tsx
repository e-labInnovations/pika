import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { type IconName } from '@/components/ui/icon-picker';
import { AccountFormFields, AccountIconSelector, AccountPreview } from '@/components/accounts-settings';
import { accountService, type Account, type AccountInput } from '@/services/api';
import { uploadService } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const EditAccount = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<AccountInput>({
    name: '',
    description: '',
    icon: 'wallet' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
    avatarId: null,
  });

  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (accountId) {
      runWithLoaderAndError(
        async () => {
          const response = await accountService.get(accountId);
          setAccount(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description || '',
            icon: response.data.icon as IconName,
            bgColor: response.data.bgColor,
            color: response.data.color,
            avatarId: response.data.avatar?.id || null,
          });
          setAvatarUrl(response.data.avatar?.url || null);
        },
        {
          loaderMessage: 'Loading account...',
        },
      );
    }
  }, [accountId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData = { ...formData };

    runWithLoaderAndError(
      async () => {
        if (avatarFile) {
          const response = await uploadService.uploadAvatar(avatarFile, 'account');
          newFormData.avatarId = response.data.id;
        } else if (avatarUrl === null) {
          newFormData.avatarId = null;
        }
        await accountService.update(accountId!, newFormData);
        useLookupStore.getState().fetchAccounts();
        navigate(`/settings/accounts`, { replace: true });
      },
      {
        loaderMessage: 'Updating account...',
        successMessage: 'Account updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Account',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await accountService.delete(accountId!);
            useLookupStore.getState().fetchAccounts();
            navigate('/settings/accounts', { replace: true });
          },
          {
            loaderMessage: 'Deleting account...',
            successMessage: 'Account deleted successfully',
          },
        );
      },
    });
  };

  const handleAvatarChange = (avatar: File | null, url: string | null) => {
    setAvatarFile(avatar);
    setAvatarUrl(url);
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
                icon={formData.icon as IconName}
                bgColor={formData.bgColor}
                color={formData.color}
                avatar={avatarUrl}
                onIconChange={(icon) => setFormData((prev) => ({ ...prev, icon }))}
                onBgColorChange={(bgColor) => setFormData((prev) => ({ ...prev, bgColor }))}
                onColorChange={(color) => setFormData((prev) => ({ ...prev, color }))}
                onAvatarChange={handleAvatarChange}
              />

              <AccountPreview
                name={formData.name}
                description={formData.description}
                icon={formData.icon as IconName}
                bgColor={formData.bgColor}
                color={formData.color}
                avatar={avatarUrl}
                balance={account.balance}
                useAvatar={!!avatarUrl}
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
