import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Save } from 'lucide-react';
import { IconRenderer } from '@/components/icon-renderer';
import { TagChip } from '@/components/tag-chip';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import { tagsService } from '@/services/api/tags.service';
import { useLookupStore } from '@/store/useLookupStore';
import { toast } from 'sonner';

const AddTag = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'tag' as IconName,
    bgColor: '#3B82F6',
    color: '#ffffff',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tagsService
      .create(formData)
      .then(() => {
        toast.success('Tag created successfully');
        useLookupStore.getState().fetchTags(); // TODO: implement loading state
        navigate('/settings/tags', { replace: true });
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Tag',
        description: 'Create a new tag for your transactions',
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

        <Button className="w-full" onClick={handleSubmit} disabled={!formData.name.trim()}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    </TabsLayout>
  );
};

export default AddTag;
