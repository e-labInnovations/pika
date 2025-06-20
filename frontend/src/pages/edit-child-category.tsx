import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { categories, type Category } from '@/data/dummy-data';
import TransactionTypeView from '@/components/transaction-type-view';
import CategoryItemView from '@/components/category-item-view';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import type { IconName } from '@/components/ui/icon-picker';

const EditChildCategory = () => {
  const { parentCategoryId, childCategoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'wallet',
    bgColor: '#3B82F6',
    color: '#ffffff',
  });

  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [childCategory, setChildCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (parentCategoryId && childCategoryId) {
      // Find the parent category
      const foundParentCategory = categories.find((cat) => cat.id === parentCategoryId);
      if (foundParentCategory) {
        setParentCategory(foundParentCategory);
      }

      // Find the child category by checking inside parent category's children
      const foundChildCategory = foundParentCategory?.children?.find((child) => child.id === childCategoryId);
      if (foundChildCategory) {
        setChildCategory(foundChildCategory);
        setFormData({
          name: foundChildCategory.name,
          description: foundChildCategory.description,
          icon: foundChildCategory.icon,
          bgColor: foundChildCategory.bgColor,
          color: foundChildCategory.color,
        });
      }
    }
  }, [parentCategoryId, childCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement child category update logic
    console.log('Updating child category:', {
      ...formData,
      id: childCategoryId,
      parentId: parentCategoryId,
    });
    navigate('/settings/categories');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
      // TODO: Implement child category deletion logic
      console.log('Deleting child category:', childCategoryId);
      navigate('/settings/categories');
    }
  };

  if (!parentCategory || !childCategory) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Child Category',
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
        title: `Edit Child Category`,
        description: `Update subcategory under ${parentCategory.name}`,
        linkBackward: '/settings/categories',
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

export default EditChildCategory;
