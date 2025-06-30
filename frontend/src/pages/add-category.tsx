import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import { type TransactionType } from '@/lib/transaction-utils';
import { IconRenderer } from '@/components/icon-renderer';
import { type IconName } from '@/components/ui/icon-picker';
import TransactionTypeView from '@/components/transaction-type-view';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import { categoryService, type CategoryInput } from '@/services/api/categories.service';
import { toast } from 'sonner';

const AddCategory = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionType = (searchParams.get('type') as TransactionType) || 'expense';

  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    description: '',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
    type: transactionType,
    parentId: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement category creation logic
    categoryService
      .create(formData)
      .then(() => {
        toast.success('Category created successfully');
        navigate('/settings/categories');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'expense':
        return 'Expense';
      case 'income':
        return 'Income';
      case 'transfer':
        return 'Transfer';
      default:
        return 'Expense';
    }
  };

  return (
    <TabsLayout
      header={{
        title: `Add ${getTransactionTypeLabel(transactionType)} Category`,
        description: 'Create a new category for your transactions',
        linkBackward: '/settings/categories',
      }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Transaction Type Display */}
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <TransactionTypeView
                  type={transactionType}
                  className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                />
              </div>

              {/* Icon and Colors */}
              <IconColorsFields
                icon={formData.icon as IconName}
                bgColor={formData.bgColor}
                color={formData.color}
                setIcon={(icon) => setFormData((prev) => ({ ...prev, icon: icon as IconName }))}
                setBgColor={(bgColor) => setFormData((prev) => ({ ...prev, bgColor: bgColor }))}
                setColor={(color) => setFormData((prev) => ({ ...prev, color: color }))}
              />

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <IconRenderer
                      iconName={formData.icon}
                      size="md"
                      color={formData.color}
                      bgColor={formData.bgColor}
                    />
                    <div>
                      <p className="font-medium">{formData.name || 'Category Name'}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formData.description || 'Category description'}
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

export default AddCategory;
