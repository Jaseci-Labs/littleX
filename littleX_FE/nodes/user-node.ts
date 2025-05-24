export interface UserNode {
  id: string;
  email: string;
  root_id: string;
  is_activated: boolean;
  is_admin: boolean;
  expiration: number;
  state: string;
  avatar: string;
}
