export interface User {
  login: string;
  password: string;
}

export interface AuthResponse {
  tokenId: string;
  userId: string;
}

export interface Ticket {
  id?: string;
  title: string;
  responsiblePerson: string;
  description: string;
}
