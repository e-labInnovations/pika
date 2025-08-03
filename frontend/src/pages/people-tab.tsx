import { PeopleList } from '@/components/people-list';
import HeaderRightActions from '@/components/people-tab/header-right-actions';
import SearchBar from '@/components/search-bar';
import TabsLayout from '@/layouts/tabs';

import { useState } from 'react';
import { usePeople } from '@/hooks/queries';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const PeopleTab = () => {
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
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default PeopleTab;
