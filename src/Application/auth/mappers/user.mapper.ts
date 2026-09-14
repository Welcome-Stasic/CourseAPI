import { User } from "../../../Domain/entitys/user.entity.js";
import { UserResponseDto } from "../DTOs/user-response.dto.js";


export class UserMapper {
  static toDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}