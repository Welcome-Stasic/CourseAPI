import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Course' })
  title: string;

  @ApiProperty({ example: 'Backend development course' })
  description: string;

  @ApiProperty({ example: 24, type: Number })
  duration: number;
}
