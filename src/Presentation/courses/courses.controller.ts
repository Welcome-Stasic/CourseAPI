import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CourseResponseDto } from "../../Application/course/DTOs/course-response.dto.js";
import { CreateCourseUseCase } from "../../Application/course/use-cases/create-course.use-case.js";
import { CreateCourseDto } from "../../Application/course/DTOs/create-course.dto.js";
import { CourseMapper } from "../../Application/course/mappers/course.mapper.js";
import { GetCoursesUseCase } from "../../Application/course/use-cases/get-courses.use-case.js";
import { GetCourseByIdUseCase } from "../../Application/course/use-cases/get-course-by-id.use-case.js";
import { DeleteCourseUseCase } from "../../Application/course/use-cases/delete-course.use-case.js";
import { UpdateCourseDto } from "../../Application/course/DTOs/update-course.dto.js";
import { UpdateCourseUsecase } from "../../Application/course/use-cases/update-course.use-case.js";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly createCourseUseCase: CreateCourseUseCase,
        private readonly getCoursesUseCase: GetCoursesUseCase,
        private readonly getCourseByIdUseCase: GetCourseByIdUseCase,
        private readonly deleteCourseUseCase: DeleteCourseUseCase,
        private readonly updateCourseUsecase: UpdateCourseUsecase,
    ) {}
    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async saveCourse(@Body() CreateCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
        const course = await this.createCourseUseCase.execute(CreateCourseDto);
        return CourseMapper.toDto(course);
    }
    @Get('getAll')
    async getCourses(): Promise<CourseResponseDto[]> {
        const courses = await this.getCoursesUseCase.execute();
        return courses.map(c => CourseMapper.toDto(c));
    }
    @Get('getById/:id')
    async getCourseById(@Param('id') id: string): Promise<CourseResponseDto> {
        const course = await this.getCourseByIdUseCase.execute(id);
        return CourseMapper.toDto(course);
    }
    @Delete('remove/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteCourse(@Param('id') id: string): Promise<void> {
        await this.deleteCourseUseCase.execute(id);
    }
    @Patch('update/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async UpdateCourse(@Param('id') id: string, @Body() UpdateCourseDto: UpdateCourseDto): Promise<CourseResponseDto> {
        const course = await this.updateCourseUsecase.execute(id, UpdateCourseDto);
        return CourseMapper.toDto(course);
    }
}