import { PeopleList } from '@/components/people-list';
import HeaderRightActions from '@/components/people-tab/header-right-actions';
import SearchBar from '@/components/search-bar';
import TabsLayout from '@/layouts/tabs';
import { useLookupStore } from '@/store/useLookupStore';
import { useState } from 'react';

const PeopleTab = () => {
  const people = useLookupStore((state) => state.people);
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
