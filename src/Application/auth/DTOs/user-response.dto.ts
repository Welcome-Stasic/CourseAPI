import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class UserResponseDto {
  @AutoMap()
  @ApiProperty()
  id: string;
  @AutoMap()
  @ApiProperty()
  email: string;
  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
