// Value objects
export const userRoles = ['ADMIN', 'USER'] as const;
export type UserRole = (typeof userRoles)[number];

// Entity
export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role: UserRole;
  createdAt: Date;
}

// DTOs
export interface UpdateUserRoleDTO {
  role: UserRole;
}
