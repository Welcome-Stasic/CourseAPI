import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY_TOKEN } from '../../../Domain/tokens.js';
import type { IRefreshTokenRepository } from '../../../Domain/repository/refresh-token.repository.interface.js';
import { User } from '@prisma/client';
import { RefreshToken } from '../../../Domain/entitys/refresh-token.entity.js';
import { TokenService } from '../../../Infrastructure/services/token.service.js';


export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenIssuerService {
    constructor(
        @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly tokenService: TokenService,
    ) {}
    async issueForUser(user: User): Promise<IssuedTokens> {
        const accessToken = await this.tokenService.signAccessToken({
            sub: user.id,
            email: user.email,
        });
        const jti = this.tokenService.generateJti();
        const refreshToken = await this.tokenService.signRefreshToken({
            sub: user.id,
            jti,
        });
        const tokenHash = this.tokenService.hashToken(refreshToken);
        const ttlMs = this.tokenService.parseTtlMs(
            process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
        );
        const refreshTokenEntity = RefreshToken.create({
            tokenHash,
            userId: user.id,
            ttlMs,
        });
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return { accessToken, refreshToken };
    }
}