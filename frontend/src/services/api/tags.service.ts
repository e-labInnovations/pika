import { BaseService } from './base.service';

export interface Tag {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
  isSystem: boolean;
}

class TagService extends BaseService<Tag> {
  constructor() {
    super('/tags');
  }
}

export const tagService = new TagService();
