import { PeopleList } from '@/components/people-list';
import HeaderRightActions from '@/components/people-tab/header-right-actions';
import SearchBar from '@/components/search-bar';
import TabsLayout from '@/layouts/tabs';

import { useState } from 'react';
import { usePeople } from '@/hooks/queries';

const PeopleTab = () => {
  const { data: people = [] } = usePeople();
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

      <PeopleList people={people} searchTerm={searchTerm} />
    </TabsLayout>
  );
};

export default PeopleTab;
