export interface User {
  login: string;
  password: string;
}

export interface AuthResponse {
  idToken: string;
  idUser: string;
}
