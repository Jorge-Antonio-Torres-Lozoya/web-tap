export type SectionSlug = 'products' | 'users' | 'profiles';

export interface Section {
  id: string;
  code: string;
  name: string;
  slug: SectionSlug;
}
