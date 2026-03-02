export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', route: '/dashboard' },
  { label: 'Movements', icon: 'fa-solid fa-person-running', route: '/movements' },
  { label: 'Workouts', icon: 'fa-solid fa-dumbbell', route: '/workouts' },
  { label: 'Programs', icon: 'fa-solid fa-clipboard-list', route: '/programs' },
];
