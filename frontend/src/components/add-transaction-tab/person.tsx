import { User, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import type { TransactionFormData } from './types';
import { useState } from 'react';
import { people } from '@/data/dummy-data';
import PeoplePicker from '../people-picker';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface PersonProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}

const Person = ({ formData, setFormData }: PersonProps) => {
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);

  const getPerson = (id: string) => {
    return people.find((person) => person.id === id);
  };

  return (
    <>
      <Card className="gap-0 p-0">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="flex items-center text-lg">
            <User className="mr-2 h-5 w-5" />
            Person
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          {formData.person ? (
            <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getPerson(formData.person)?.avatar} alt={getPerson(formData.person)?.name} />
                  <AvatarFallback className="bg-purple-500 font-semibold text-white">
                    {getPerson(formData.person)
                      ?.name.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">{getPerson(formData.person)?.name}</span>
                  <p className="line-clamp-1 text-sm text-slate-500">{getPerson(formData.person)?.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFormData((prev) => ({ ...prev, person: null }))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start"
              onClick={() => setShowPeoplePicker(true)}
            >
              Select a person
            </Button>
          )}
        </CardContent>
      </Card>

      <PeoplePicker
        isOpen={showPeoplePicker}
        onClose={() => setShowPeoplePicker(false)}
        onSelect={(person) => setFormData((prev) => ({ ...prev, person: person.id }))}
        selectedPersonId={formData.person?.toString()}
      />
    </>
  );
};

export default Person;
