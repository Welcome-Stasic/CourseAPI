import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller.js";
import { CreateCourseUseCase } from "../../Application/course/use-cases/create-course.use-case.js";
import { GetCoursesUseCase } from "../../Application/course/use-cases/get-courses.use-case.js";
import { COURSE_REPOSITORY_TOKEN } from "../../Domain/tokens.js";
import { GetCourseByIdUseCase } from "../../Application/course/use-cases/get-course-by-id.use-case.js";
import { DeleteCourseUseCase } from "../../Application/course/use-cases/delete-course.use-case.js";
import { UpdateCourseUsecase } from "../../Application/course/use-cases/update-course.use-case.js";
import { PrismaCourseRepository } from "../../Infrastructure/repositories/prisma-course.repository.js";
import { AuthModule } from "../auth/auth.module.js";
import { CourseProfile } from "../../Application/course/mappers/course.profile.js";

@Module({
    controllers: [CoursesController],
    providers: [
        {
            provide: COURSE_REPOSITORY_TOKEN,
            useClass: PrismaCourseRepository,
        },
        CreateCourseUseCase,
        GetCoursesUseCase,
        GetCourseByIdUseCase,
        DeleteCourseUseCase,
        UpdateCourseUsecase,
        CourseProfile
    ],
})
export class CoursesModule {};