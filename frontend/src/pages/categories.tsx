import { categories } from '@/data/dummy-data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TabsLayout from '@/layouts/tabs';
import CategoryItem from '@/components/categories/category-item';
import CategoriesTabs from '@/components/categories/categories-tabs';
import TransactionUtils, { type TransactionType } from '@/lib/transaction-utils';

const Categories = () => {
  const onDeleteCategory = (id: string) => {
    // Handle delete
    console.log('Delete category:', id);
  };

  const onEditCategory = (id: string) => {
    // Handle edit
    console.log('Edit category:', id);
  };

  const onAddChildCategory = (id: string) => {
    // Handle add child category
    console.log('Add child category:', id);
  };

  const getCategoriesByType = (type: TransactionType) => {
    return categories.filter((category) => category.type === type);
  };

  const tabContents = TransactionUtils.types.map((type) => ({
    id: type.id,
    content: (
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
        {getCategoriesByType(type.id).map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddChildCategory={onAddChildCategory}
          />
        ))}
      </div>
    ),
  }));

  return (
    <TabsLayout
      header={{
        title: 'Categories',
        description: 'Manage your categories',
        rightActions: (
          <Button variant="outline" size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        ),
        linkBackward: '/settings',
      }}
    >
      <CategoriesTabs tabContents={tabContents} />
    </TabsLayout>
  );
};

export default Categories;
