import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { type TransactionType } from '@/lib/transaction-utils';
import { IconRenderer } from '@/components/icon-renderer';
import { type IconName } from '@/components/ui/icon-picker';
import TransactionTypeView from '@/components/transaction-type-view';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import { categoryService, type Category, type CategoryInput } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { toast } from 'sonner';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    description: '',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
    type: 'expense',
    parentId: null,
  });

  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (categoryId) {
      // Find the category in the categories array
      categoryService
        .get(categoryId)
        .then((response) => {
          setCategory(response.data);
          setTransactionType(response.data.type);
          setFormData((prev) => ({
            ...prev,
            name: response.data.name,
            description: response.data.description,
            icon: response.data.icon,
            bgColor: response.data.bgColor,
            color: response.data.color,
            type: response.data.type,
            parentId: response.data.parentId,
          }));
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }, [categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    runWithLoaderAndError(
      async () => {
        await categoryService.update(categoryId || '', formData);
        useLookupStore.getState().fetchCategories();
        navigate(`/settings/categories?type=${transactionType}`, { replace: true });
      },
      {
        loaderMessage: 'Updating category...',
        successMessage: 'Category updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await categoryService.delete(categoryId || '');
            useLookupStore.getState().fetchCategories();
            navigate(`/settings/categories?type=${transactionType}`, { replace: true });
          },
          {
            loaderMessage: 'Deleting category...',
            successMessage: 'Category deleted successfully',
          },
        );
      },
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

  if (!category) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Category',
          description: 'Category not found',
          linkBackward: '/settings/categories',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Category not found</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: `Edit ${getTransactionTypeLabel(category.type)} Category`,
        description: 'Update category information',
        linkBackward: `/settings/categories?type=${transactionType}`,
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
                  type={category.type}
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

export default EditCategory;
