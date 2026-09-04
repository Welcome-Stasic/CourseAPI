import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller.js";
import { InMemoryCourseRepository } from "../../Infrastructure/repositories/in-memory-course.repository.js";
import { CreateCourseUseCase } from "../../Application/course/use-cases/create-course.use-case.js";
import { GetCoursesUseCase } from "../../Application/course/use-cases/get-courses.use-case.js";
import { COURSE_REPOSITORY_TOKEN } from "../../Domain/tokens.js";

@Module({
    controllers: [CoursesController],
    providers: [
        {
            provide: COURSE_REPOSITORY_TOKEN,
            useClass: InMemoryCourseRepository,
        },
        CreateCourseUseCase,
        GetCoursesUseCase
    ],
})
export class CoursesModule {};