import type { AxiosResponse } from 'axios';
import { BaseService } from './base.service';
import type { Category } from './categories.service';
import type { Account } from './accounts.service';
import type { Person } from './people.service';
import type { Tag } from './tags.service';

export interface AppInfo {
  name: string;
  version: string;
  description: string;
  app_id: string;
  base_url: string;
}

export interface AppLists {
  categories: Category[];
  accounts: Account[];
  people: Person[];
  tags: Tag[];
}

class AppService extends BaseService<AppInfo> {
  constructor() {
    super('/app');
  }

  getInfo(): Promise<AxiosResponse<AppInfo>> {
    return this.api.get(`${this.endpoint}/info`);
  }

  getLists(): Promise<AxiosResponse<AppLists>> {
    return this.api.get(`${this.endpoint}/lists`);
  }
}

export const appService = new AppService();
