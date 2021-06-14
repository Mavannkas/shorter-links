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
  user: UserActiveResponse;
  message: string;
};

export interface ResendResponse {
  message: string;
}
