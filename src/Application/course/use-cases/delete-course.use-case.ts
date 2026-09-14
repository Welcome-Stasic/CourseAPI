import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ICourseRepository } from "../../../Domain/repository/course.repository.interface.js";
import { COURSE_REPOSITORY_TOKEN } from "../../../Domain/tokens.js";

@Injectable()

export class DeleteCourseUseCase {
    constructor(
        @Inject(COURSE_REPOSITORY_TOKEN)
        private readonly courseRepository: ICourseRepository,
    ) {}

    async execute(id: string): Promise<void> {
        const course = await this.courseRepository.findById(id);
        if (!course) {
            throw new NotFoundException('Курс не найден');
        }
        await this.courseRepository.delete(id);
    }
}