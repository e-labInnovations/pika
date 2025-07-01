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

class TagsService extends BaseService<Tag> {
  constructor() {
    super('/tags');
  }
}

export const tagsService = new TagsService();
