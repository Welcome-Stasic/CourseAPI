import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { COURSE_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";
import type { ICourseRepository } from "../../../Domain/course.repository.interface.js";
import { Course } from "../../../Domain/course.entity.js";

@Injectable()
export class GetCourseByIdUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY_TOKEN)
        private readonly courseRepository: ICourseRepository,
    ) {}

    async execute(id: string): Promise<Course> {
        const course = await this.courseRepository.findById(id);
        
        if (!course) {
            throw new NotFoundException("Курс не найден")
        }
        return course;
    }
}