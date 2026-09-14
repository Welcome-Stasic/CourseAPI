import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { USER_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";
import type { IUserRepository } from "../../../Domain/repository/user.repository.interface.js";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "@prisma/client";

export interface JwtPayLoad {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: IUserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        })
    }

    async validate(payload: JwtPayLoad): Promise<User> {
        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }
        return user;
    }
}