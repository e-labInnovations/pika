import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import { type IconName } from '@/components/ui/icon-picker';
import { categories, tags } from '@/data/dummy-data';
import {
  AccountFormFields,
  AccountIconSelector,
  AccountPreview,
  InitialBalanceSection,
} from '@/components/accounts-settings';

const AddAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'wallet' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
    avatar: '',
  });

  const [includeInitialBalance, setIncludeInitialBalance] = useState(false);
  const [initialBalance, setInitialBalance] = useState(0);

  // Get system category and tag for initial balance
  const initialBalanceCategory = categories.find((cat) => cat.name === 'Initial Balance');
  const initialBalanceTag = tags.find((tag) => tag.name === 'Initial Balance');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement account creation logic
    const accountData = {
      ...formData,
      balance: includeInitialBalance ? initialBalance : 0,
    };

    console.log('Creating account:', accountData);

    // If initial balance is included, create a transaction
    if (includeInitialBalance && initialBalance !== 0 && initialBalanceCategory && initialBalanceTag) {
      const transactionData = {
        title: `Initial Balance - ${formData.name}`,
        amount: Math.abs(initialBalance),
        type: initialBalance >= 0 ? 'income' : 'expense',
        category: initialBalanceCategory,
        account: {
          id: 'temp-id', // Will be replaced with actual account ID
          name: formData.name,
          icon: formData.icon,
          bgColor: formData.bgColor,
          color: formData.color,
        },
        tags: [initialBalanceTag],
        note: `Initial balance for ${formData.name}`,
      };
      console.log('Creating initial balance transaction:', transactionData);
    }

    navigate('/settings/accounts');
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Account',
        description: 'Create a new account for your transactions',
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

              <InitialBalanceSection
                includeInitialBalance={includeInitialBalance}
                initialBalance={initialBalance}
                onIncludeInitialBalanceChange={setIncludeInitialBalance}
                onInitialBalanceChange={setInitialBalance}
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
                balance={includeInitialBalance ? initialBalance : 0}
                useAvatar={!!formData.avatar}
              />
            </form>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSubmit} disabled={!formData.name.trim()}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </TabsLayout>
  );
};

export default AddAccount;
