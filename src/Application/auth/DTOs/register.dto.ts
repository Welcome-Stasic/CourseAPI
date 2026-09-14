import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDTO {
    @ApiProperty()
    @IsEmail({}, { message: "Некорректный email" })
    email: string;
    @ApiProperty()
    @IsString()
    @MinLength(8, { message: "Пароль минимум 8 символов" })
    @MaxLength(72, { message: "Пароль не может быть длинее 72 символов" })
    password: string;
}