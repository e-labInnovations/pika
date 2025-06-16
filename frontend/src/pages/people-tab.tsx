import { PeopleList } from "@/components/people-list";
import HeaderRightActions from "@/components/people-tab/header-right-actions";
import SearchBar from "@/components/search-bar";
import { people as peopleData, type Person } from "@/data/dummy-data";
import TabsLayout from "@/layouts/tabs";
import { useEffect, useState } from "react";

const PeopleTab = () => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [showPeopleSearch, setShowPeopleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    return () => setPeople(peopleData);
  }, []);

  const addPerson = (person: Omit<Person, "id">) => {
    const newPerson = {
      ...person,
      id: Math.max(...people.map((p) => p.id), 0) + 1,
      totalSpent: 0,
      totalReceived: 0,
    };
    setPeople((prev) => [newPerson, ...prev]);
  };

  const updatePerson = (id: number, updates: Partial<Person>) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePerson = (id: number) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <TabsLayout
      header={{
        title: "People",
        description: "Manage your people",
        rightActions: (
          <HeaderRightActions
            showPeopleSearch={showPeopleSearch}
            setShowPeopleSearch={setShowPeopleSearch}
          />
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
