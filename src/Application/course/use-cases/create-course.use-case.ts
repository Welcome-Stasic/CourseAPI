import { Inject } from "@nestjs/common";
import { Course } from "../../../Domain/entitys/course.entity.js";
import type { ICourseRepository } from "../../../Domain/repository/course.repository.interface.js";
import { CreateCourseDto } from "../DTOs/create-course.dto.js";
import { COURSE_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";

export class CreateCourseUseCase {
    constructor(@Inject(COURSE_REPOSITORY_TOKEN) private readonly courseRepository: ICourseRepository) {}

    async execute(dto: CreateCourseDto): Promise<Course> {
        const newCourse = Course.create(dto);
        await this.courseRepository.save(newCourse);
        return newCourse;
    }
}