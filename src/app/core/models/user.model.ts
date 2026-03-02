export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
}

export type UserRole = 'admin' | 'manager' | 'trainer' | 'staff';
