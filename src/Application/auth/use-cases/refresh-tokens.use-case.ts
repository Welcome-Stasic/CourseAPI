import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { REFRESH_TOKEN_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";
import type { IUserRepository } from "../../../Domain/repository/user.repository.interface.js";
import type { IRefreshTokenRepository } from "../../../Domain/repository/refresh-token.repository.interface.js";
import { TokenService } from "../../../Infrastructure/services/token.service.js";
import { RefreshTokenDto } from "../DTOs/refresh-token.dto.js";
import { AuthResponseDto } from "../DTOs/auth-response.dto.js";
import { TokenIssuerService } from "../services/token-issuer.service.js";
import { InjectMapper } from "@automapper/nestjs";
import type { Mapper } from "@automapper/core";
import { UserResponseDto } from "../DTOs/user-response.dto.js";
import { User } from "../../../Domain/entitys/user.entity.js";

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
        private readonly refreshTokenRepository: IRefreshTokenRepository,
        private readonly tokenService: TokenService,
        private readonly tokenIssuer: TokenIssuerService,
        @InjectMapper() private readonly mapper: Mapper
    ) {}

    async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
        try {
            await this.tokenService.verifyRefreshToken(dto.refreshToken);
        } catch {
            throw new UnauthorizedException('Невалидный refresh-токен');
        }
        const tokenHash = this.tokenService.hashToken(dto.refreshToken);
        const storedToken = await this.refreshTokenRepository.findByHash(tokenHash);
        if (!storedToken) {
            throw new UnauthorizedException('Refresh-токен не найден');
        }
        if (storedToken.isRevoked()) {
            await this.refreshTokenRepository.revokeAllForUser(storedToken.userId);
            throw new UnauthorizedException('Обнаружено повторное использование токена. Все сессии завершены');
        }
        if (storedToken.isExpired()) {
            throw new UnauthorizedException('Refresh-токен истёк');
        }

        const user = await this.userRepository.findById(storedToken.userId);
        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }
        storedToken.revoke();
        await this.refreshTokenRepository.save(storedToken);

        const { accessToken, refreshToken } = await this.tokenIssuer.issueForUser(user);

        return {
            accessToken,
            refreshToken,
            user: this.mapper.map(user, User, UserResponseDto),
        };
    }

}