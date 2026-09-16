import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../../Application/auth/use-cases/register.use-case.js';
import { LoginUseCase } from '../../Application/auth/use-cases/login.use-case.js';
import { RefreshTokenUseCase } from '../../Application/auth/use-cases/refresh-tokens.use-case.js';
import { LogoutUseCase } from '../../Application/auth/use-cases/logout.use-case.js';
import { RegisterDTO } from '../../Application/auth/DTOs/register.dto.js';
import { LoginDto } from '../../Application/auth/DTOs/login.dto.js';
import { RefreshTokenDto } from '../../Application/auth/DTOs/refresh-token.dto.js';
import { AuthResponseDto } from '../../Application/auth/DTOs/auth-response.dto.js';
import { UserResponseDto } from '../../Application/auth/DTOs/user-response.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { User } from '../../Domain/entitys/user.entity.js';
import { MapInterceptor } from '@automapper/nestjs';
import { LogoutAllUseCase } from '../../Application/auth/use-cases/logout-all.use-case.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokensUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly LogoutAllUseCase: LogoutAllUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email уже занят' })
  async register(@Body() dto: RegisterDTO): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление пары токенов' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Невалидный refresh-токен' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokensUseCase.execute(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @UseInterceptors(MapInterceptor(User, UserResponseDto))
  async me(@CurrentUser() user: User): Promise<UserResponseDto> {
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Выход из текущей сессии' })
  @ApiResponse({ status: 204, description: 'Успех' })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.logoutUseCase.execute(dto);
  }

  @Post('logoutAll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Выйти со всех устройств' })
  @ApiResponse({ status: 204, description: 'Все сессии завершены' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async logoutAll(@CurrentUser() user: User): Promise<void> {
    return this.LogoutAllUseCase.execute(user.id);
  }
}
