import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  title: string;

  @AutoMap()
  @ApiProperty()
  description: string;

  @ApiProperty()
  @AutoMap()
  duration: number;

  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
  
  @AutoMap()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
