export interface UserResponse {
  id: number;
  role: Role;
  firstName?: string;
  lastName?: string;
  email: string;
  profileImage?: string;
  connectedAccounts: ConnectedAccount[];
  authorities: string[]
}

interface ConnectedAccount {
  provider: 'google' | 'github' | 'facebook' | 'okta' ;
  connectedAt: string;
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}