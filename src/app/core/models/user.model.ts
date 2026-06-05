export interface Phone {
  country_code: string;
  number: string;
}

export interface UserListItem {
  id: string;
  code: string;
  username: string;
  name: string;
  created_at: string;
}

export interface UserProfileRef {
  id: string;
  code: string;
  name: string;
}

export interface UserDetail {
  id: string;
  code: string;
  name: string;
  username: string;
  phone: Phone | null;
  profile_photo: string | null;
  profiles: UserProfileRef[];
  created_at: string;
  updated_at: string;
}
