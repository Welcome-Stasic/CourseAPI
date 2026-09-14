import { RefreshToken } from '../entitys/refresh-token.entity.js';

export interface IRefreshTokenRepository {
  save(token: RefreshToken): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshToken | null>;
  revokeAllForUser(userId: string): Promise<void>;
  deleteExpired(now: Date): Promise<void>;
}