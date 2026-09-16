export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  tokenVersion?: number;
  createdAt?: Date;
  updatedAt?: Date;
}