// Entity
export interface Category {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  createdAt: Date;
}

// DTOs
export interface CreateCategoryDTO {
  name: string;
  color?: string | null;
  icon?: string | null;
}
