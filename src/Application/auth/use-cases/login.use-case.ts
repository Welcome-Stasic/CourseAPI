import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  USER_REPOSITORY_TOKEN,
  REFRESH_TOKEN_REPOSITORY_TOKEN,
} from '../../../Domain/tokens.js';
import type { IUserRepository } from '../../../Domain/repository/user.repository.interface.js';
import { PasswordHasher } from '../../../Infrastructure/services/password-hasher.service.js';
import { LoginDto } from '../DTOs/login.dto.js';
import { AuthResponseDto } from '../DTOs/auth-response.dto.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { TokenIssuerService } from '../services/token-issuer.service.js';

const DUMMY_HASH = process.env.DUMMY_HASH || '$2b$10$IwRR5w/QCfblYNAweuPSD.0VwznDhPHyha20T2vWuuL7M7AIrihpq';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenIssuer: TokenIssuerService
    ) {}
    async execute(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            await this.passwordHasher.compare(dto.password, DUMMY_HASH);
            throw new UnauthorizedException('Неверный email или пароль');
        }
        const isPasswordValid = await this.passwordHasher.compare(
            dto.password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
        }
        const { accessToken, refreshToken } = await this.tokenIssuer.issueForUser(user);
        return {
            accessToken,
            refreshToken,
            user: UserMapper.toDto(user),
        };
    }
}