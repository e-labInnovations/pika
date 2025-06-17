import { categories } from '@/data/dummy-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import TabsLayout from '@/layouts/tabs';

const Categories = () => {
  const onDeleteCategory = (id: string) => {
    // Handle delete
    console.log('Delete category:', id);
  };

  const onEditCategory = (id: string) => {
    // Handle edit
    console.log('Edit category:', id);
  };

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
      <div className="">
        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-0">
              <CardContent className="p-4">
                {/* Parent Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: category.bgColor,
                        color: category.color,
                      }}
                    >
                      <DynamicIcon name={category.icon as IconName} className="h-5 w-5 text-white" />
                    </div>
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
                            if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                              onDeleteCategory(category.id);
                            }
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
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: child.bgColor,
                            color: child.color,
                          }}
                        >
                          <DynamicIcon name={child.icon as IconName} className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{child.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{child.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!child.isSystem && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => onEditCategory(child.id)}>
                              <Edit2 className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${child.name}"?`)) {
                                  onDeleteCategory(child.id);
                                }
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
                    // onClick={() => onAddChildCategory(category.id)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Subcategory</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TabsLayout>
  );
};

export default Categories;
