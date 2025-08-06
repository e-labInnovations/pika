import { PeopleList } from '@/components/people-list';
import HeaderRightActions from '@/components/people-tab/header-right-actions';
import SearchBar from '@/components/search-bar';
import TabsLayout from '@/layouts/tabs';

import { useState } from 'react';
import { usePeople } from '@/hooks/queries';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/lucide';
import { useNavigate } from 'react-router-dom';

const PeopleTab = () => {
  const navigate = useNavigate();
  const { data: people = [], isLoading, error } = usePeople();
  const [showPeopleSearch, setShowPeopleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <TabsLayout
      header={{
        title: 'People',
        description: 'Manage your people',
        rightActions: (
          <HeaderRightActions showPeopleSearch={showPeopleSearch} setShowPeopleSearch={setShowPeopleSearch} />
        ),
      }}
    >
      {showPeopleSearch && (
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchToggle={setShowPeopleSearch}
          placeholder="Search people..."
        />
      )}

      <AsyncStateWrapper isLoading={isLoading} error={error}>
        <PeopleList people={people} searchTerm={searchTerm} />
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full items-center justify-center gap-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
          onClick={() => navigate('/people/add')}
        >
          <DynamicIcon name="plus" className="h-4 w-4" />
          <span>Add Person</span>
        </Button>
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default PeopleTab;
