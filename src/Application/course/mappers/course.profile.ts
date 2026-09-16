import { Injectable } from "@nestjs/common"
import { Course } from "../../../Domain/entitys/course.entity.js"
import { CourseResponseDto } from "../DTOs/course-response.dto.js"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { type Mapper } from "@automapper/core"
import { createAutoMap } from "../../common/mappers/create-auto-map.js"

@Injectable()
export class CourseProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) { 
        super(mapper) 
    }
    override get profile() {
        return (mapper: Mapper) => {
            createAutoMap(mapper, Course, CourseResponseDto)
        }
    }
}
