export interface User {
  login: string;
  password: string;
}

export interface AuthResponse {
  tokenId: string;
  userId: string;
}
