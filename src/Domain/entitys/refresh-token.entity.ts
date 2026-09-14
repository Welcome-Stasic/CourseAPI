import { RefreshTokenProps } from "../types/refreshTokenProps.types.js";

export class RefreshToken {
  private readonly _id: string;
  private readonly _tokenHash: string;
  private readonly _userId: string;
  private readonly _expiresAt: Date;
  private readonly _createdAt?: Date;
  private _revokedAt?: Date | null;

  constructor(props: RefreshTokenProps) {
    this._id = props.id;
    this._tokenHash = props.tokenHash;
    this._userId = props.userId;
    this._expiresAt = props.expiresAt;
    this._createdAt = props.createdAt;
    this._revokedAt = props.revokedAt;
  }

  get id(): string { return this._id; } 
  get tokenHash(): string { return this._tokenHash; }
  get userId(): string { return this._userId; }
  get expiresAt(): Date { return this._expiresAt; }
  get createdAt(): Date { return this._createdAt || new Date(); }
  get revokedAt(): Date | null { return this._revokedAt || null; }

  isExpired(): boolean {
    return this._expiresAt.getTime() <= new Date().getTime();
  }

  isRevoked(): boolean {
    return this._revokedAt !== null;
  }

  isActive(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }
  revoke(now: Date = new Date()): void { 
    if (this.isRevoked()) {
      return;
    }
    this._revokedAt = now;
  }

  static create(props: {
    tokenHash: string;
    userId: string;
    ttlMs: number;
  }): RefreshToken { 
    if (!props.tokenHash) {
        throw new Error('Хеш токена нет');
    }
    if (!props.userId) {
        throw new Error('ID пользователя нет');
    }
    if (props.ttlMs <= 0) {
        throw new Error('TTL токена должен быть положительным');
    }
    const now = new Date();
    return new RefreshToken({
        id: crypto.randomUUID(),
        tokenHash: props.tokenHash,
        userId: props.userId,
        expiresAt: new Date(now.getTime() + props.ttlMs),
        createdAt: now,
        revokedAt: null,
    });
  }
static restore(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }
}