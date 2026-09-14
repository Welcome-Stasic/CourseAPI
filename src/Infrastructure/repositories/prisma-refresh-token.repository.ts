import { Injectable } from "@nestjs/common";
import { IRefreshTokenRepository } from "../../Domain/repository/refresh-token.repository.interface.js";
import { PrismaService } from "../db/prisma.service.js";
import { Prisma } from "@prisma/client";
import { RefreshToken } from "../../Domain/entitys/refresh-token.entity.js";

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}
    async save(token: RefreshToken): Promise<void> {
        await this.prisma.refreshToken.upsert({
            where: { id: token.id },
            create: {
                id: token.id,
                tokenHash: token.tokenHash,
                userId: token.userId,
                expiresAt: token.expiresAt,
                createdAt: token.createdAt,
                revokedAt: token.revokedAt,
            },
            update: {
                revokedAt: token.revokedAt,
            },
        });
    }
    async findByHash(tokenHash: string): Promise<RefreshToken | null> {
        const record = await this.prisma.refreshToken.findFirst({
            where: { tokenHash },
        });
        return record ? this.toDomain(record) : null;
    }
    async revokeAllForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    async deleteExpired(now: Date): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: now } },
        });
    }
    private toDomain(record: Prisma.RefreshTokenGetPayload<object>): RefreshToken {
        return RefreshToken.restore({
            id: record.id,
            tokenHash: record.tokenHash,
            userId: record.userId,
            expiresAt: record.expiresAt,
            createdAt: record.createdAt,
            revokedAt: record.revokedAt,
        });
    }
}