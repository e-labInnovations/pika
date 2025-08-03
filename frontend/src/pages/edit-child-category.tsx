import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { DynamicIcon } from '@/components/lucide';
import TransactionTypeView from '@/components/transaction-type-view';
import CategoryItemView from '@/components/category-item-view';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import type { IconName } from '@/components/ui/icon-picker';
import { categoryService, type Category, type CategoryInput } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import type { TransactionType } from '@/lib/transaction-utils';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const EditChildCategory = () => {
  const { parentCategoryId, childCategoryId } = useParams();
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    description: '',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
    type: 'expense',
    parentId: null,
  });

  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (parentCategoryId && childCategoryId) {
      fetchChildCategory();
    } else {
      setError(new Error('Category not found'));
    }
  }, [parentCategoryId, childCategoryId]);

  const fetchChildCategory = () => {
    setIsLoading(true);
    setError(null);
    categoryService
      .get(parentCategoryId!)
      .then((response) => {
        setParentCategory(response.data);
        setTransactionType(response.data.type);
        categoryService
          .get(childCategoryId!)
          .then((response) => {
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
            setError(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    runWithLoaderAndError(
      async () => {
        await categoryService.update(childCategoryId || '', formData);
        useLookupStore.getState().fetchCategories();
        navigate(`/settings/categories?type=${transactionType}`, { replace: true });
      },
      {
        loaderMessage: 'Updating child category...',
        successMessage: 'Child category updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Child Category',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await categoryService.delete(childCategoryId || '');
            useLookupStore.getState().fetchCategories();
            navigate(`/settings/categories?type=${transactionType}`, { replace: true });
          },
          {
            loaderMessage: 'Deleting child category...',
            successMessage: 'Child category deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: `Edit Child Category`,
        description: `Update subcategory under ${parentCategory?.name}`,
        linkBackward: `/settings/categories?type=${transactionType}`,
      }}
    >
      <AsyncStateWrapper
        isLoading={isLoading}
        error={error}
        linkBackward="/settings/categories"
        onRetry={fetchChildCategory}
      >
        <div className="flex flex-col gap-6">
          {/* Parent Category Info */}
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Parent Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryItemView
                category={parentCategory!}
                size="md"
                className="rounded-md bg-slate-100 p-3 dark:bg-slate-800"
              />
            </CardContent>
          </Card>

          {/* Child Category Form */}
          <Card>
            <CardHeader>
              <CardTitle>Child Category Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type Display */}
                <div className="space-y-2">
                  <Label>Transaction Type</Label>
                  <TransactionTypeView
                    type={parentCategory?.type || 'expense'}
                    className="rounded-md bg-slate-100 p-3 dark:bg-slate-800"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter child category name"
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
                    placeholder="Enter child category description"
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
                    <CategoryItemView
                      category={{
                        ...formData,
                        name: formData.name || 'Child Category Name',
                        description: formData.description || 'Child category description',
                        type: parentCategory?.type || 'expense',
                        isSystem: false,
                        id: 'child-category-id',
                        isParent: false,
                      }}
                      size="md"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="destructive" onClick={handleDelete} className="w-1/2">
              <DynamicIcon name="trash-2" className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()} className="w-1/2">
              <DynamicIcon name="save" className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default EditChildCategory;
