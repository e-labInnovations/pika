import { tags } from '@/data/dummy-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { IconRenderer } from '@/components/icon-renderer';
import { useNavigate } from 'react-router-dom';

const Tags = () => {
  const navigate = useNavigate();

  const onDeleteTag = (id: string) => {
    // Handle delete
    console.log('Delete tag:', id);
  };

  const onEditTag = (id: string) => {
    navigate(`/settings/tags/${id}/edit`);
  };

  const onAddTag = () => {
    navigate('/settings/tags/add');
  };

  return (
    <TabsLayout
      header={{
        title: 'Tags',
        description: 'Manage your tags',
        rightActions: (
          <Button variant="outline" size="icon" className="rounded-full" onClick={onAddTag}>
            <Plus className="h-4 w-4" />
          </Button>
        ),
        linkBackward: '/settings',
      }}
    >
      <div className="flex flex-col gap-2">
        {tags.map((tag) => (
          <Card key={tag.id} className="p-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconRenderer iconName={tag.icon} size="md" bgColor={tag.bgColor} color={tag.color} />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">{tag.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tag.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!tag.isSystem && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => onEditTag(tag.id)}>
                        <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${tag.name}"?`)) {
                            onDeleteTag(tag.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          onClick={onAddTag}
        >
          <Plus className="h-4 w-4" />
          <span>Add Tag</span>
        </Button>
      </div>
    </TabsLayout>
  );
};

export default Tags;
