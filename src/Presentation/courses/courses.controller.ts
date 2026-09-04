import { Body, Controller, Get, Post } from "@nestjs/common";
import { CourseResponseDto } from "../../Application/course/dto/course-response.dto.js";
import { CreateCourseUseCase } from "../../Application/course/use-cases/create-course.use-case.js";
import { CreateCourseDto } from "../../Application/course/dto/create-course.dto.js";
import { CourseMapper } from "../../Application/course/mappers/course.mapper.js";
import { GetCoursesUseCase } from "../../Application/course/use-cases/get-courses.use-case.js";

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly createCourseUseCase: CreateCourseUseCase,
        private readonly getCoursesUseCase: GetCoursesUseCase
    ) {}

    @Post('create')
    async saveCourse(@Body() CreateCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
        const course = await this.createCourseUseCase.execute(CreateCourseDto);
        return CourseMapper.toDto(course);
    }
    @Get('getAll')
    async getCourses(): Promise<CourseResponseDto[]> {
        const courses = await this.getCoursesUseCase.execute();
        return courses.map(c => CourseMapper.toDto(c));
    }
}