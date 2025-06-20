import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon } from 'lucide-react';
import type { TransactionFormData } from './types';
import { useState } from 'react';
import { tags } from '@/data/dummy-data';
import { TagChip } from '../tag-chip';
import { IconRenderer } from '../icon-renderer';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    setShowTagSuggestions(tagInput.length > 0);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowTagSuggestions(false), 150);
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
              <TagChip
                key={tagId}
                name={getTag(tagId)?.name || ''}
                iconName={getTag(tagId)?.icon}
                size="sm"
                onClose={() => removeTag(tagId)}
                color={getTag(tagId)?.color}
                bgColor={getTag(tagId)?.bgColor}
              />
            ))}
          </div>
        )}

        {/* Tag Input */}
        <div className="relative">
          <Input
            placeholder="Search and add tags..."
            value={tagInput}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          {/* Tag Suggestions */}
          {showTagSuggestions && filteredTagSuggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              {filteredTagSuggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="flex w-full items-center space-x-3 px-3 py-2 text-left text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                  onClick={() => addTag(tag.id)}
                >
                  <IconRenderer iconName={tag.icon} size="sm" color={tag.color} bgColor={tag.bgColor} />
                  <div className="flex flex-col">
                    <span className="font-medium">{tag.name}</span>
                    {tag.description && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">{tag.description}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {showTagSuggestions && filteredTagSuggestions.length === 0 && tagInput.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-10 mt-1 rounded-md border border-slate-200 bg-white p-3 text-center text-sm text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              No tags found matching "{tagInput}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Tags;
