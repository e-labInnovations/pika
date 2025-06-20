import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Category } from '@/data/dummy-data';
import { IconRenderer } from '../icon-renderer';

interface CategoryItemProps {
  category: Category;
  onEditCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddChildCategory: (id: string) => void;
  onEditChildCategory: (parentId: string, childId: string) => void;
  onDeleteChildCategory: (id: string) => void;
}

const CategoryItem = ({
  category,
  onEditCategory,
  onDeleteCategory,
  onAddChildCategory,
  onEditChildCategory,
  onDeleteChildCategory,
}: CategoryItemProps) => {
  return (
    <Card key={category.id} className="p-0">
      <CardContent className="p-4">
        {/* Parent Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconRenderer iconName={category.icon} size="md" bgColor={category.bgColor} color={category.color} />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">{category.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!category.isSystem && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onEditCategory(category.id)}>
                  <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onDeleteCategory(category.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Child Categories */}
        <div className="mt-4 ml-4 space-y-2">
          {category.children?.map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-2 dark:border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <IconRenderer iconName={child.icon} bgColor={child.bgColor} color={child.color} />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{child.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{child.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!child.isSystem && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => onEditChildCategory(category.id, child.id)}>
                      <Edit2 className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onDeleteChildCategory(child.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
            onClick={() => onAddChildCategory(category.id)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Subcategory</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryItem;
