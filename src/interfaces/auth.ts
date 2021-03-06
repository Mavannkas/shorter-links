import { User } from 'src/user/entity/user.entity';

export interface NewUserResponse {
  user_id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface UserActiveResponse {
  name: string;
}

export type VerifyResponse = {
  ok: string;
};

export interface ResendResponse {
  message: string;
}

export interface TokenResponse {
  token_id: string;
  user_id: User;
  created_at: Date;
  ip: string;
  agent: string;
  referrer: string;
  name: string | null;
  active?: boolean;
}

export interface TokenItem {
  token_id: string;
  created_at: Date;
  ip: string;
  agent: string;
  referrer: string;
  name: string | null;
  active?: boolean;
}

export interface TokenPageResponse {
  items: TokenItem[];
  page: number;
  lastPage: number;
}

export interface RecoveryPasswordResponse {
  ok: string;
}
