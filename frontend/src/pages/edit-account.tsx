import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { DynamicIcon } from '@/components/lucide';
import { type IconName } from '@/components/ui/icon-picker';
import { AccountFormFields, AccountIconSelector, AccountPreview } from '@/components/accounts-settings';
import { accountService, type Account, type AccountInput } from '@/services/api';
import { uploadService } from '@/services/api';
import { useAccountMutations } from '@/hooks/queries';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const EditAccount = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { updateAccount, deleteAccount } = useAccountMutations();
  const [account, setAccount] = useState<Account | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const [formData, setFormData] = useState<AccountInput>({
    name: '',
    description: '',
    icon: 'wallet' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
    avatarId: null,
  });

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    } else {
      setError(new Error('Account not found'));
    }
  }, [accountId]);

  const fetchAccount = () => {
    setIsLoading(true);
    setError(null);
    accountService
      .get(accountId!)
      .then((response) => {
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
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
        await updateAccount.mutateAsync({ id: accountId!, data: newFormData });
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
            await deleteAccount.mutateAsync(accountId!);
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

  return (
    <TabsLayout
      header={{
        title: 'Edit Account',
        description: 'Update account information',
        linkBackward: '/settings/accounts',
      }}
      bottom={{
        child: (
          <div className="flex w-full flex-row gap-2">
            <Button variant="destructive" disabled={isLoading} onClick={handleDelete} className="flex-1">
              <DynamicIcon name="trash-2" className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim() || isLoading} className="flex-1">
              <DynamicIcon name="save" className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        ),
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error} linkBackward="/settings/accounts">
        <div className="flex flex-col gap-6">
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
                  balance={account?.balance || 0}
                  useAvatar={!!avatarUrl}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default EditAccount;
