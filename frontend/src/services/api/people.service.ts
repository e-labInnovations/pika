import { BaseService } from './base.service';

type PersonAvatar = {
  id: string;
  url: string;
  type: string;
  name: string;
  size: string;
};

export interface Person {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  avatar: PersonAvatar | null;
  lastTransactionAt: string | null;
  totalTransactions: number;
  balance: number;
}

export interface PersonDetailed extends Person {
  totalSummary: {
    totalSpent: string;
    totalReceived: string;
  };
}

export interface PersonInput {
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarId: string | null;
  description: string | null;
}

class PeopleService extends BaseService<Person | PersonDetailed> {
  constructor() {
    super('/people');
  }
}

export const peopleService = new PeopleService();
