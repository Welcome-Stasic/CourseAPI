import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { REFRESH_TOKEN_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";
import type { IUserRepository } from "../../../Domain/repository/user.repository.interface.js";
import { PasswordHasher } from "../../../Infrastructure/services/password-hasher.service.js";
import { RegisterDTO } from "../DTOs/register.dto.js";
import { AuthResponseDto } from "../DTOs/auth-response.dto.js";
import { User } from "../../../Domain/entitys/user.entity.js";
import { TokenIssuerService } from "../services/token-issuer.service.js";
import { UserResponseDto } from "../DTOs/user-response.dto.js";
import { type Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenIssuer: TokenIssuerService,
        @InjectMapper() private readonly mapper: Mapper
    ) {}
    
    async execute(dto: RegisterDTO): Promise<AuthResponseDto> {
        const IsEmptyemail = await this.userRepository.findByEmail(dto.email);
        if (IsEmptyemail) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }
        
        const passwordHash = await this.passwordHasher.hash(dto.password);

        const user = User.create({
            email: dto.email,
            passwordHash,
        })
        await this.userRepository.save(user);
        const { accessToken, refreshToken } = await this.tokenIssuer.issueForUser(user);
        return {
            accessToken,
            refreshToken,
            user: this.mapper.map(user, User, UserResponseDto),
        }
    }

}