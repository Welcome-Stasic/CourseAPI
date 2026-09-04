import { Course } from "./course.entity.js";

export interface ICourseRepository {
    save(course: Course): Promise<void>;
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    delete(id: string): Promise<void>;
}