import { Course } from "../../../Domain/course.entity.js";
import { CourseResponseDto } from "../dto/course-response.dto.js";

export class CourseMapper {
    static toDto(course: Course): CourseResponseDto {
        return {
            id: course.id,
            title: course.title,
            description: course.description,
            duration: course.duration,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }
    }
}