import { BaseService } from './base.service';

export interface Person {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  avatar: {
    id: string;
    url: string;
    type: string;
    name: string;
    size: string;
  };
  lastTransactionAt: string | null;
  totalTransactions: number;
  balance: number;
}

export interface PersonInput {
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarId: string | null;
  description: string | null;
}

class PeopleService extends BaseService<Person> {
  constructor() {
    super('/people');
  }
}

export const peopleService = new PeopleService();
