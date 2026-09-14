import { Inject, Injectable } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY_TOKEN } from '../../../Domain/tokens.js';
import type { IRefreshTokenRepository } from '../../../Domain/repository/refresh-token.repository.interface.js';
import { TokenService } from '../../../Infrastructure/services/token.service.js';
import { RefreshTokenDto } from '../../auth/DTOs/refresh-token.dto.js';

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly tokenService: TokenService,
    ) {}

    async execute(dto: RefreshTokenDto): Promise<void> {
        const tokenHash = this.tokenService.hashToken(dto.refreshToken);
        const storedToken = await this.refreshTokenRepository.findByHash(tokenHash);

        if (!storedToken) { return; }
        if (storedToken.isRevoked()) { return; }

        storedToken.revoke();
        await this.refreshTokenRepository.save(storedToken);
    }
}