import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import TransactionTypeView from '@/components/transaction-type-view';
import CategoryItemView from '@/components/category-item-view';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import type { IconName } from '@/components/ui/icon-picker';
import { categoryService, type Category, type CategoryInput } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { toast } from 'sonner';
import type { TransactionType } from '@/lib/transaction-utils';
import { runWithLoaderAndError } from '@/lib/utils';

const AddChildCategory = () => {
  const { parentCategoryId } = useParams();
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    description: '',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
    type: 'expense',
    parentId: parentCategoryId || null,
  });

  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (parentCategoryId) {
      // Find the parent category in the categories array
      categoryService
        .get(parentCategoryId)
        .then((response) => {
          setParentCategory(response.data);
          setTransactionType(response.data.type);
          setFormData((prev) => ({
            ...prev,
            type: response.data.type,
            parentId: response.data.id,
          }));
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }, [parentCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    runWithLoaderAndError(
      async () => {
        await categoryService.create(formData);
        await useLookupStore.getState().fetchCategories();
        navigate(`/settings/categories?type=${transactionType}`, { replace: true });
      },
      {
        loaderMessage: 'Creating child category...',
        successMessage: 'Child category created successfully',
      },
    );
  };

  if (!parentCategory) {
    return (
      <TabsLayout
        header={{
          title: 'Add Child Category',
          description: 'Parent category not found',
          linkBackward: '/settings/categories',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Parent category not found</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: `Add Child Category`,
        description: `Create a subcategory under ${parentCategory.name}`,
        linkBackward: `/settings/categories?type=${transactionType}`,
      }}
    >
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Parent Category Info */}
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Parent Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryItemView
              category={parentCategory}
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
                  type={parentCategory.type}
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
                      type: parentCategory.type,
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

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!formData.name.trim()} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </TabsLayout>
  );
};

export default AddChildCategory;
