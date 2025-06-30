import { PeopleList } from '@/components/people-list';
import HeaderRightActions from '@/components/people-tab/header-right-actions';
import SearchBar from '@/components/search-bar';
import TabsLayout from '@/layouts/tabs';
import { personService, type Person } from '@/services/api/people.service';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const PeopleTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [showPeopleSearch, setShowPeopleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    personService
      .list()
      .then((response) => {
        setPeople(response.data);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
