import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordHasher {
    private static readonly SALT_ROUNDS = 10;
    async hash(plain: string): Promise<string> {
        return bcrypt.hash(plain, PasswordHasher.SALT_ROUNDS);
    }
    async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}