export interface RefreshTokenProps {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt?: Date;
  revokedAt?: Date | null;
}