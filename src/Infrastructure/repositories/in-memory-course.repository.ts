import { Course } from "../../Domain/course.entity.js";
import { ICourseRepository } from "../../Domain/course.repository.interface.js";

export class InMemoryCourseRepository implements ICourseRepository {
    private courses: Course[] = [];

    async save(course: Course): Promise<void> {
        const idxCourse = this.courses.findIndex(c => c.id === course.id);
        if (idxCourse >= 0) {
            this.courses[idxCourse] = course;
        } else {
            this.courses.push(course);
        }
    }
    async findAll(): Promise<Course[]> {
        return this.courses;
    }
    async findById(id: string): Promise<Course | null> {
        return this.courses.find(c => c.id === id) || null;
    }
    async delete(id: string): Promise<void> {
        this.courses = this.courses.filter(c => c.id !== id);
    }
}