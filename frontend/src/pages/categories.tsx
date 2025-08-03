import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/lucide';
import TabsLayout from '@/layouts/tabs';
import CategoryItem from '@/components/categories/category-item';
import CategoriesTabs from '@/components/categories/categories-tabs';
import TransactionUtils, { type TransactionType } from '@/lib/transaction-utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type Category } from '@/services/api';
import { useCategories, useCategoryMutations } from '@/hooks/queries';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import { runWithLoaderAndError } from '@/lib/utils';

const Categories = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionType = (searchParams.get('type') as TransactionType) || 'expense';
  const { data: categories = [] } = useCategories();
  const { deleteCategory } = useCategoryMutations();

  useEffect(() => {
    navigate(`/settings/categories?type=${transactionType}`);
  }, [transactionType, navigate]);

  const onDeleteCategory = (category: Category) => {
    useConfirmDialog.getState().open({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await deleteCategory.mutateAsync(category.id);
          },
          {
            loaderMessage: 'Deleting category...',
            successMessage: 'Category deleted successfully',
          },
        );
      },
    });
  };

  const onEditCategory = (id: string) => {
    navigate(`/settings/categories/${id}/edit`);
  };

  const onAddChildCategory = (id: string) => {
    navigate(`/settings/categories/${id}/add`);
  };

  const onEditChildCategory = (parentId: string, childId: string) => {
    navigate(`/settings/categories/${parentId}/${childId}/edit`);
  };

  const onDeleteChildCategory = (childCategory: Category) => {
    useConfirmDialog.getState().open({
      title: 'Delete Child Category',
      message: `Are you sure you want to delete "${childCategory.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await deleteCategory.mutateAsync(childCategory.id);
          },
          {
            loaderMessage: 'Deleting child category...',
            successMessage: 'Child category deleted successfully',
          },
        );
      },
    });
  };

  const onAddCategory = (type: TransactionType | undefined) => {
    navigate(`/settings/categories/add?type=${type || transactionType}`);
  };

  const getCategoriesByType = (type: TransactionType) => {
    return categories.filter((category) => category.type === type);
  };

  const onTabChange = (transactionType: TransactionType) => {
    navigate(`/settings/categories?type=${transactionType}`, { replace: true });
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
            onEditChildCategory={onEditChildCategory}
            onDeleteChildCategory={onDeleteChildCategory}
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
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => onAddCategory(undefined)}>
            <DynamicIcon name="plus" className="h-4 w-4" />
          </Button>
        ),
        linkBackward: '/settings',
      }}
    >
      <CategoriesTabs tabContents={tabContents} onTabChange={onTabChange} tabValue={transactionType} />
    </TabsLayout>
  );
};

export default Categories;
