import { PeopleList } from "@/components/people-list";
import HeaderRightActions from "@/components/people-tab/header-right-actions";
import SearchBar from "@/components/search-bar";
import { people as peopleData } from "@/data/dummy-data";
import TabsLayout from "@/layouts/tabs";
import { useState } from "react";

const PeopleTab = () => {
  const [showPeopleSearch, setShowPeopleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

      <PeopleList people={peopleData} searchTerm={searchTerm} />
    </TabsLayout>
  );
};

export default PeopleTab;
