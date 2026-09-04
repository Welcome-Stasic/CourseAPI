import { Inject } from "@nestjs/common";
import { Course } from "../../../Domain/course.entity.js";
import type { ICourseRepository } from "../../../Domain/course.repository.interface.js";
import { COURSE_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";

export class GetCoursesUseCase {
    constructor(@Inject(COURSE_REPOSITORY_TOKEN) private readonly courseRepository: ICourseRepository) {}

    async execute(): Promise<Course[]> {
        return await this.courseRepository.findAll();
    }
}