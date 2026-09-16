import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN, REFRESH_TOKEN_REPOSITORY_TOKEN } from '../../../Domain/tokens.js';
import type { IUserRepository } from '../../../Domain/repository/user.repository.interface.js';
import type { IRefreshTokenRepository } from '../../../Domain/repository/refresh-token.repository.interface.js';

@Injectable()
export class LogoutAllUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    user.incrementTokenVersion();
    await this.userRepository.save(user);
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }
}