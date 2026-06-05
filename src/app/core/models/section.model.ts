export type SectionSlug = 'products' | 'users' | 'profiles';

export const SECTION_SLUGS: readonly SectionSlug[] = ['products', 'users', 'profiles'];

export function isSectionSlug(value: unknown): value is SectionSlug {
  return typeof value === 'string' && SECTION_SLUGS.some((slug) => slug === value);
}

export interface Section {
  id: string;
  code: string;
  name: string;
  slug: SectionSlug;
}
