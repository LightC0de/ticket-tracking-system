export interface User {
  login: string;
  password: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  tokenId: string;
  userId: string;
  isAdmin: boolean;
}

export interface DeleteTicketResponse {
  ticketId: string;
  userId: string;
}

export interface CloseTicketResponse {
  ticketId: string;
  isActionClose: boolean;
  userId: string;
}

export interface CreateTicketResponse {
  userId: string;
  ticketId: string;
  newTicket: Ticket;
}

export interface Ticket {
  id?: number;
  title: string;
  assignee: string;
  reporter: string;
  description: string;
  isClosed: boolean;
}
