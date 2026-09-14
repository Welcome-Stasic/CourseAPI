import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../Domain/repository/user.repository.interface.js";
import { PrismaService } from "../db/prisma.service.js";
import { User } from "../../Domain/entitys/user.entity.js";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}
    async save(user: User): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                passwordHash: user.passwordHash,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    async findByEmail(email: string): Promise<User | null> {
        const record = await this.prisma.user.findUnique({
             where: {
                email: email.toLowerCase(),
            },
        });

        return record ? this.toDomain(record) : null;
    }
    async findById(id: string): Promise<User | null> {
        const record = await this.prisma.user.findUnique({
            where: { id },
        });
        return record ? this.toDomain(record) : null;
    }
    private toDomain(record: Prisma.UserGetPayload<object>): User {
        return new User({
            id: record.id,
            email: record.email,
            passwordHash: record.passwordHash,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }
}