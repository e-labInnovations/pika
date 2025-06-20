import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save, Trash2 } from 'lucide-react';
import { tags, type Tag } from '@/data/dummy-data';
import { IconRenderer } from '@/components/icon-renderer';
import { TagChip } from '@/components/tag-chip';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';

const EditTag = () => {
  const { tagId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'tag' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
  });

  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    if (tagId) {
      // Find the tag in the tags array
      const foundTag = tags.find((tag) => tag.id === tagId);
      if (foundTag) {
        setTag(foundTag);
        setFormData({
          name: foundTag.name,
          description: foundTag.description,
          icon: foundTag.icon as IconName,
          bgColor: foundTag.bgColor,
          color: foundTag.color,
        });
      }
    }
  }, [tagId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement tag update logic
    console.log('Updating tag:', { ...formData, id: tagId });
    navigate('/settings/tags');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
      // TODO: Implement tag deletion logic
      console.log('Deleting tag:', tagId);
      navigate('/settings/tags');
    }
  };

  if (!tag) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Tag',
          description: 'Tag not found',
          linkBackward: '/settings/tags',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Tag not found</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: 'Edit Tag',
        description: 'Update tag information',
        linkBackward: '/settings/tags',
      }}
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
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

export default EditTag;
