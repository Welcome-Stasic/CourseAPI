import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { REFRESH_TOKEN_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from '../../Domain/tokens.js';
import { PrismaUserRepository } from '../../Infrastructure/repositories/prisma-user.repository.js';
import { PrismaRefreshTokenRepository } from '../../Infrastructure/repositories/prisma-refresh-token.repository.js';
import { PasswordHasher } from '../../Infrastructure/services/password-hasher.service.js';
import { TokenService } from '../../Infrastructure/services/token.service.js';
import { TokenIssuerService } from '../../Application/auth/services/token-issuer.service.js';
import { RegisterUseCase } from '../../Application/auth/use-cases/register.use-case.js';
import { LoginUseCase } from '../../Application/auth/use-cases/login.use-case.js';
import { RefreshTokenUseCase } from '../../Application/auth/use-cases/refresh-tokens.use-case.js';
import { LogoutUseCase } from '../../Application/auth/use-cases/logout.use-case.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { UserProfile } from '../../Application/auth/mappers/user.profile.js';

@Global()
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: PrismaUserRepository,
        },
        {
            provide: REFRESH_TOKEN_REPOSITORY_TOKEN,
            useClass: PrismaRefreshTokenRepository,
        },
        PasswordHasher,
        TokenService,
        TokenIssuerService,
        RegisterUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        LogoutUseCase,
        JwtStrategy,
        UserProfile
    ],
    exports: [PassportModule], 
})
export class AuthModule {}
