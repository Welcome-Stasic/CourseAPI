import { Injectable } from "@nestjs/common";
import { PrismaService } from "../db/prisma.service.js";
import { ICourseRepository } from "../../Domain/repository/course.repository.interface.js";
import { CourseProps, Course } from "../../Domain/entitys/course.entity.js";

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
    constructor( private readonly prisma: PrismaService ) {}

    async save(course: Course): Promise<void> {
        await this.prisma.course.upsert({
            where: {
                id: course.id,
            },
            create: {
                id: course.id,
                title: course.title,
                description: course.description,
                duration: course.duration,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
            },
            update: {
                title: course.title,
                description: course.description,
                duration: course.duration,
                updatedAt: course.updatedAt,
            },
        });
    }
    async findAll(): Promise<Course[]> {
        const records = await this.prisma.course.findMany();
        return records.map((record: CourseProps) => this.toDomain(record));
    }

    async findById(id: string): Promise<Course | null> {
        const record = await this.prisma.course.findUnique({
            where: {
                id,
            },
        });
        return record ? this.toDomain(record) : null;
    }
    async delete(id: string): Promise<void> {
        await this.prisma.course.delete({
            where: {
                id,
            },
        });
    }
    private toDomain(record: CourseProps): Course {
        return new Course({
            id: record.id,
            title: record.title,
            description: record.description,
            duration: record.duration,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }
}
