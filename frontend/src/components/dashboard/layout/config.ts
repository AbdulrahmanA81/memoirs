import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'customers', title: 'Reference Faces', href: paths.dashboard.customers, icon: 'users' },
  { key: 'account', title: 'Album Upload', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'Chat', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
