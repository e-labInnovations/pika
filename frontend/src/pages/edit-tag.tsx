import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { DynamicIcon } from '@/components/lucide';
import { IconRenderer } from '@/components/icon-renderer';
import { TagChip } from '@/components/tag-chip';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import { tagsService } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const EditTag = () => {
  const navigate = useNavigate();
  const { tagId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'tag' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
  });

  useEffect(() => {
    if (tagId) {
      fetchTag();
    } else {
      setError(new Error('Tag not found'));
    }
  }, [tagId]);

  const fetchTag = () => {
    setIsLoading(true);
    setError(null);
    tagsService
      .get(tagId!)
      .then((response) => {
        setFormData({
          name: response.data.name,
          description: response.data.description,
          icon: response.data.icon as IconName,
          bgColor: response.data.bgColor,
          color: response.data.color,
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
        await tagsService.update(tagId!, formData);
        useLookupStore.getState().fetchTags();
        navigate('/settings/tags', { replace: true });
      },
      {
        loaderMessage: 'Updating tag...',
        successMessage: 'Tag updated successfully',
      },
    );
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Tag',
      message: `Are you sure you want to delete "${formData.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await tagsService.delete(tagId!);
            useLookupStore.getState().fetchTags();
            navigate('/settings/tags', { replace: true });
          },
          {
            loaderMessage: 'Deleting tag...',
            successMessage: 'Tag deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: 'Edit Tag',
        description: 'Update tag information',
        linkBackward: '/settings/tags',
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error} linkBackward="/settings/tags" onRetry={fetchTag}>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tag Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter tag name"
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
                    placeholder="Enter tag description"
                  />
                </div>

                {/* Icon and Colors */}
                <IconColorsFields
                  icon={formData.icon}
                  bgColor={formData.bgColor}
                  color={formData.color}
                  setIcon={(icon) => setFormData((prev) => ({ ...prev, icon: icon as IconName }))}
                  setBgColor={(bgColor) => setFormData((prev) => ({ ...prev, bgColor: bgColor }))}
                  setColor={(color) => setFormData((prev) => ({ ...prev, color: color }))}
                />

                {/* Preview */}
                <div className="space-y-4">
                  <Label>Preview</Label>

                  {/* Card-style Preview */}
                  <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <IconRenderer
                        iconName={formData.icon}
                        size="md"
                        color={formData.color}
                        bgColor={formData.bgColor}
                      />
                      <div>
                        <p className="font-medium">{formData.name || 'Tag Name'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formData.description || 'Tag description'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge-style Preview */}
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600 dark:text-slate-400">As it appears in transactions:</Label>
                    <div className="flex flex-wrap gap-2">
                      <TagChip
                        name={formData.name || 'Tag Name'}
                        iconName={formData.icon}
                        bgColor={formData.bgColor}
                        color={formData.color}
                        size="sm"
                      />
                    </div>
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

export default EditTag;
