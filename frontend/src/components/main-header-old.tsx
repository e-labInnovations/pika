import { Button } from "./ui/button";
import { ChevronLeft, Search, Filter, Plus, ArrowDownUp } from "lucide-react";

interface MainHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTransactionId: number | null;
  setSelectedTransactionId: (id: number | null) => void;
  selectedPersonId: number | null;
  setSelectedPersonId: (id: number | null) => void;
  showTransactionSearch: boolean;
  setShowTransactionSearch: (show: boolean) => void;
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  showSortModal: boolean;
  setShowSortModal: (show: boolean) => void;
}

const MainHeader = ({
  activeTab,
  setActiveTab,
  selectedTransactionId,
  setSelectedTransactionId,
  selectedPersonId,
  setSelectedPersonId,
  showTransactionSearch,
  setShowTransactionSearch,
  setShowFilterModal,
  setShowSortModal,
}: MainHeaderProps) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(activeTab !== "home" ||
              selectedTransactionId ||
              selectedPersonId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedTransactionId) {
                    setSelectedTransactionId(null);
                  } else if (selectedPersonId) {
                    setSelectedPersonId(null);
                  } else {
                    setActiveTab("home");
                  }
                }}
                className="text-slate-600 dark:text-slate-400 p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏔️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedTransactionId
                    ? "Transaction Details"
                    : selectedPersonId
                    ? "Person Details"
                    : activeTab === "home"
                    ? "Dashboard"
                    : activeTab === "transactions"
                    ? "Transactions"
                    : activeTab === "add"
                    ? "Add Transaction"
                    : activeTab === "people"
                    ? "People"
                    : activeTab === "settings"
                    ? "Settings"
                    : "Pika"}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedTransactionId || selectedPersonId
                    ? "View and manage details"
                    : activeTab === "home"
                    ? "Your financial overview"
                    : activeTab === "transactions"
                    ? "Track your financial activity"
                    : activeTab === "add"
                    ? "Record a new transaction"
                    : activeTab === "people"
                    ? "Manage your contacts"
                    : activeTab === "settings"
                    ? "App preferences and data"
                    : "Personal Finance"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {activeTab === "transactions" && !selectedTransactionId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400"
                  onClick={() =>
                    setShowTransactionSearch(!showTransactionSearch)
                  }
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400"
                  onClick={() => setShowFilterModal(true)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 dark:text-slate-400"
                  onClick={() => setShowSortModal(true)}
                >
                  <ArrowDownUp className="w-4 h-4" />
                </Button>
              </>
            )}

            {activeTab === "people" && !selectedPersonId && (
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  // This would trigger the add person functionality
                  console.log("Add person from header");
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}

            {activeTab === "settings" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}

            {activeTab === "home" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
