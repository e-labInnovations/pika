import { Card, CardContent } from '../ui/card';
import { ChevronRight } from 'lucide-react';
import type { SettingSection } from '@/data/types';
import { useNavigate } from 'react-router-dom';
import { IconRenderer } from '../icon-renderer';

const SectionsItem = ({ section }: { section: SettingSection }) => {
  const navigate = useNavigate();
  return (
    <Card key={section.id} className={`group p-0 ${section.bgColor}`} onClick={() => navigate(section.link)}>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <IconRenderer iconName={section.icon} bgColor={section.iconColor} color="white" />
          <h4 className="text-sm font-medium text-slate-900 dark:text-white">{section.title}</h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {section.description}
          </p>
          <ChevronRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionsItem;
