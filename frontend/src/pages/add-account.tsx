import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { DynamicIcon } from '@/components/lucide';
import { type IconName } from '@/components/ui/icon-picker';
import {
  AccountFormFields,
  AccountIconSelector,
  AccountPreview,
  InitialBalanceSection,
} from '@/components/accounts-settings';
import { uploadService, type AccountInput } from '@/services/api';
import { useAccountMutations } from '@/hooks/queries';
import { runWithLoaderAndError } from '@/lib/utils';

const AddAccount = () => {
  const navigate = useNavigate();
  const { createAccount } = useAccountMutations();

  const [formData, setFormData] = useState<AccountInput>({
    name: '',
    description: '',
    icon: 'wallet' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
    avatarId: null,
  });

  const [includeInitialBalance, setIncludeInitialBalance] = useState(false);
  const [initialBalance, setInitialBalance] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Get system category and tag for initial balance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    runWithLoaderAndError(
      async () => {
        const newFormData = { ...formData };

        if (avatarFile) {
          const response = await uploadService.uploadAvatar(avatarFile, 'account');
          newFormData.avatarId = response.data.id;
        }

        await createAccount.mutateAsync(newFormData);
        navigate('/settings/accounts', { replace: true });
      },
      {
        loaderMessage: 'Creating account...',
        successMessage: 'Account created successfully',
      },
    );

    // ToDo: If initial balance is included, create a transaction
    // if (includeInitialBalance && initialBalance !== 0 && initialBalanceCategory && initialBalanceTag) {
    //   const transactionData = {
    //     title: `Initial Balance - ${formData.name}`,
    //     amount: Math.abs(initialBalance),
    //     type: initialBalance >= 0 ? 'income' : 'expense',
    //     category: initialBalanceCategory,
    //     account: {
    //       id: 'temp-id', // Will be replaced with actual account ID
    //       name: formData.name,
    //       icon: formData.icon,
    //       bgColor: formData.bgColor,
    //       color: formData.color,
    //     },
    //     tags: [initialBalanceTag],
    //     note: `Initial balance for ${formData.name}`,
    //   };
    //   console.log('Creating initial balance transaction:', transactionData);
    // }
  };

  const handleAvatarChange = (avatar: File | null, url: string | null) => {
    setAvatarFile(avatar);
    setAvatarUrl(url);
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Account',
        description: 'Create a new account for your transactions',
        linkBackward: '/settings/accounts',
      }}
    >
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

              <InitialBalanceSection
                includeInitialBalance={includeInitialBalance}
                initialBalance={initialBalance}
                onIncludeInitialBalanceChange={setIncludeInitialBalance}
                onInitialBalanceChange={setInitialBalance}
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
                balance={includeInitialBalance ? initialBalance : 0}
                useAvatar={!!avatarUrl}
              />
            </form>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSubmit} disabled={!formData.name.trim()}>
          <DynamicIcon name="save" className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </TabsLayout>
  );
};

export default AddAccount;
