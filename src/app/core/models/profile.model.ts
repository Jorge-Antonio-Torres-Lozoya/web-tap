import { SectionSlug } from './section.model';

export interface Profile {
  id: string;
  code: string;
  name: string;
  sections: { code: string; name: string; slug: SectionSlug }[];
  created_at: string;
  updated_at: string;
}

// On write, sections is an array of slugs (objects are returned on read).
export interface ProfilePayload {
  name: string;
  sections: SectionSlug[];
}
