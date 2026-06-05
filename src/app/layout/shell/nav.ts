import { SectionSlug } from '@core/models';

export interface NavItem {
  slug: SectionSlug;
  label: string;
  path: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { slug: 'products', label: 'Productos', path: '/products' },
  { slug: 'users', label: 'Usuarios', path: '/users' },
  { slug: 'profiles', label: 'Perfiles', path: '/profiles' },
];
