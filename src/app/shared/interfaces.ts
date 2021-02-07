export interface User {
  login: string;
  password: string;
}

export interface AuthResponse {
  tokenId: string;
  userId: string;
  isAdmin: string;
}

export interface CreateResponse {
  ticketId: string;
}

export interface Ticket {
  id?: number;
  title: string;
  assignee: string;
  reporter: string;
  description: string;
  isClosed: boolean;
}
