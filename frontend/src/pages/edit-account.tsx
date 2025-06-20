import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { accounts, type Account } from '@/data/dummy-data';
import { IconRenderer } from '@/components/icon-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';

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

  const [useAvatar, setUseAvatar] = useState(false);
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
        // Set useAvatar based on whether account has an avatar
        setUseAvatar(!!foundAccount.avatar);
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
                        ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
