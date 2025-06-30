import { BaseService } from './base.service';

export interface AccountAvatar {
  id: string;
  url: string;
  type: string;
  name: string;
  size: string;
}

export interface Account {
  id: string;
  name: string;
  description: string;
  avatar: AccountAvatar | null;
  lastTransactionAt: string | null;
  totalTransactions: number;
  balance: number;
  icon: string;
  bgColor: string;
  color: string;
}

export interface AccountInput {
  name: string;
  description: string;
  avatarId: string | null;
  icon: string;
  bgColor: string;
  color: string;
}

class AccountService extends BaseService<Account> {
  constructor() {
    super('/accounts');
  }
}

export const accountService = new AccountService();
