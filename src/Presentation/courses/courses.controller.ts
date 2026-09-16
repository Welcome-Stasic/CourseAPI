import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { CourseResponseDto } from "../../Application/course/DTOs/course-response.dto.js";
import { CreateCourseUseCase } from "../../Application/course/use-cases/create-course.use-case.js";
import { CreateCourseDto } from "../../Application/course/DTOs/create-course.dto.js";
import { GetCoursesUseCase } from "../../Application/course/use-cases/get-courses.use-case.js";
import { GetCourseByIdUseCase } from "../../Application/course/use-cases/get-course-by-id.use-case.js";
import { DeleteCourseUseCase } from "../../Application/course/use-cases/delete-course.use-case.js";
import { UpdateCourseDto } from "../../Application/course/DTOs/update-course.dto.js";
import { UpdateCourseUsecase } from "../../Application/course/use-cases/update-course.use-case.js";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { Course } from "../../Domain/entitys/course.entity.js";
import { MapInterceptor } from "@automapper/nestjs";

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
    @ApiOperation({ summary: 'Создание курса' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(MapInterceptor(Course, CourseResponseDto))
    async saveCourse(@Body() CreateCourseDto: CreateCourseDto): Promise<Course> {
        const course = await this.createCourseUseCase.execute(CreateCourseDto);
        return course;
    }
    @Get('getAll')
    @ApiOperation({ summary: 'Получить все курсы' })
    @UseInterceptors(MapInterceptor(Course, CourseResponseDto, { isArray: true }))
    async getCourses(): Promise<Course[]> {
        return this.getCoursesUseCase.execute();
    }
    @Get('getById/:id')
    @ApiOperation({ summary: 'Получить курс по id' })
    @UseInterceptors(MapInterceptor(Course, CourseResponseDto))
    async getCourseById(@Param('id') id: string): Promise<Course> {
        const course = await this.getCourseByIdUseCase.execute(id);
        return course;
    }
    @Delete('remove/:id')
    @ApiOperation({ summary: 'Удалить курс по id' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    async DeleteCourse(@Param('id') id: string): Promise<void> {
        await this.deleteCourseUseCase.execute(id);
    }
    @Patch('update/:id')
    @ApiOperation({ summary: 'Обновить курс по id' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(MapInterceptor(Course, CourseResponseDto))
    async UpdateCourse(@Param('id') id: string, @Body() UpdateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.updateCourseUsecase.execute(id, UpdateCourseDto);
        return course;
    }
}