export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  full_name_display: string;
  color: string;
  bio: string;
  lang: string;
  theme: string;
  timezone: string;
  is_active: boolean;
  photo: string | null;
  big_photo: string | null;
  gravatar_id: string;
  roles: string[];
  total_private_projects: number;
  total_public_projects: number;
}

export interface AuthResponse {
  auth_token: string;
  refresh?: string;
  token?: string;
  id: number;
  username: string;
  email: string;
  full_name: string;
  full_name_display: string;
  color: string;
  bio: string;
  lang: string;
  theme: string;
  timezone: string;
  is_active: boolean;
  photo: string | null;
  big_photo: string | null;
  gravatar_id: string;
  roles: string[];
  total_private_projects?: number;
  total_public_projects?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  full_name: string;
  accepted_terms: boolean;
}
