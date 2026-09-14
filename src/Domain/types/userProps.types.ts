export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}