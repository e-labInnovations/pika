import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon, X } from 'lucide-react';
import type { TransactionFormData } from './types';
import { useState } from 'react';
import { tags } from '@/data/dummy-data';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

interface TagsProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}

const Tags = ({ formData, setFormData }: TagsProps) => {
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const filteredTagSuggestions = tags.filter(
    (tag) => tag.name.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(tag.id),
  );

  const getTag = (id: string) => {
    return tags.find((tag) => tag.id === id);
  };

  const addTag = (tagId: string) => {
    if (tagId && !formData.tags.includes(tagId)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagId],
      }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagId),
    }));
  };
  return (
    <Card className="gap-0 p-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center text-lg">
          <TagIcon className="mr-2 h-5 w-5" />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tagId) => (
              <Badge
                key={tagId}
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
              >
                <DynamicIcon name={getTag(tagId)?.icon as IconName} className="mr-2 h-4 w-4" />
                {getTag(tagId)?.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-emerald-600 hover:text-emerald-800"
                  onClick={() => removeTag(tagId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div className="relative">
          <Input
            placeholder="Add tags..."
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setShowTagSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
          />

          {/* Tag Suggestions */}
          {showTagSuggestions && filteredTagSuggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {filteredTagSuggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="w-full px-3 py-2 text-left text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() => addTag(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Tags;
