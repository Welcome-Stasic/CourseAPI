import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ICourseRepository } from "../../../Domain/repository/course.repository.interface.js";
import { COURSE_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";
import { Course } from "../../../Domain/entitys/course.entity.js";
import { UpdateCourseDto } from "../DTOs/update-course.dto.js";

@Injectable()

export class UpdateCourseUsecase {
    constructor(
        @Inject(COURSE_REPOSITORY_TOKEN)
        private readonly courseRepository: ICourseRepository,
    ) {}

    async execute(id: string, dto: UpdateCourseDto): Promise<Course> {
        const course = await this.courseRepository.findById(id);

        if (!course) {
            throw new NotFoundException("Курс не найден");
        }
        
        course.updateDetails(
            dto.title,
            dto.description,
            dto.duration,
        );
        await this.courseRepository.save(course);
        return course;
    }
}