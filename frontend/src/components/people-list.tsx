import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import type { Person } from "@/data/dummy-data";
import { useNavigate } from "react-router-dom";

interface PeopleListProps {
  people: Person[];
  searchTerm: string;
}

export function PeopleList({ people, searchTerm }: PeopleListProps) {
  const navigate = useNavigate();
  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-emerald-600 dark:text-emerald-400";
    if (balance < 0) return "text-red-500 dark:text-red-400";
    return "text-slate-600 dark:text-slate-400";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {filteredPeople.map((person) => (
          <Card
            key={person.id}
            className="p-0"
            onClick={() => navigate(`/people/${person.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={person.avatar || "/placeholder.svg"}
                      alt={person.name}
                    />
                    <AvatarFallback className="bg-emerald-500 text-white font-semibold">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-white truncate">
                        {person.name}
                      </h4>
                      <div className="text-right">
                        <span
                          className={`font-semibold ${getBalanceColor(
                            person.balance
                          )}`}
                        >
                          {person.balance === 0
                            ? "Even"
                            : `$${Math.abs(person.balance).toFixed(2)}`}
                        </span>
                        {person.balance !== 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {person.balance > 0 ? "owes you" : "you owe"}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {person.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last: {person.lastTransaction}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {person.transactionCount} transactions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No people found</p>
        </div>
      )}
    </div>
  );
}
