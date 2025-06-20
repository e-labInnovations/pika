import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import { IconRenderer } from '@/components/icon-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import { categories, tags } from '@/data/dummy-data';
import MoneyInput from '@/components/money-input';

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

  const [useAvatar, setUseAvatar] = useState(false);
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter account name"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter account description (e.g., bank name, account type, etc.)"
                  rows={3}
                />
              </div>

              {/* Initial Balance */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="initial-balance"
                    checked={includeInitialBalance}
                    onCheckedChange={setIncludeInitialBalance}
                  />
                  <Label htmlFor="initial-balance">Include Initial Balance</Label>
                </div>

                {includeInitialBalance && (
                  <div className="space-y-2">
                    <MoneyInput
                      value={initialBalance}
                      onChange={(amount) => setInitialBalance(amount)}
                      id="balance"
                      labelText="Initial Balance"
                      placeholder="0.00"
                      currency="₹"
                      className="text-xl font-bold"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This will create a system transaction to set the initial balance for this account.
                    </p>
                  </div>
                )}
              </div>

              {/* Avatar/Icon Selection */}
              <div className="space-y-4">
                <Label>Account Icon</Label>

                {/* Toggle between Avatar and Icon */}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={!useAvatar ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseAvatar(false)}
                  >
                    Icon
                  </Button>
                  <Button
                    type="button"
                    variant={useAvatar ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseAvatar(true)}
                  >
                    Image
                  </Button>
                </div>

                {useAvatar ? (
                  /* Avatar Upload */
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={formData.avatar} alt="Account avatar" />
                        <AvatarFallback className="text-lg">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Upload Image</span>
                          </Button>
                        </Label>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        {formData.avatar && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Icon Selection */
                  <IconColorsFields
                    icon={formData.icon}
                    bgColor={formData.bgColor}
                    color={formData.color}
                    setIcon={(icon) => setFormData((prev) => ({ ...prev, icon: icon as IconName }))}
                    setBgColor={(bgColor) => setFormData((prev) => ({ ...prev, bgColor: bgColor }))}
                    setColor={(color) => setFormData((prev) => ({ ...prev, color: color }))}
                  />
                )}
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    {useAvatar && formData.avatar ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={formData.avatar} alt="Account avatar" />
                        <AvatarFallback>{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <IconRenderer
                        iconName={formData.icon}
                        size="md"
                        color={formData.color}
                        bgColor={formData.bgColor}
                      />
                    )}
                    <div>
                      <p className="font-medium">{formData.name || 'Account Name'}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formData.description || 'Account description'}
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        $
                        {includeInitialBalance
                          ? initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })
                          : '0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
