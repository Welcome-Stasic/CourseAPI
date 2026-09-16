import { type Mapper } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { UserResponseDto } from "../DTOs/user-response.dto.js";
import { User } from "../../../Domain/entitys/user.entity.js";
import { createAutoMap } from "../../common/mappers/create-auto-map.js";

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) { 
        super(mapper) 
    }
    override get profile() {
        return (mapper: Mapper) => {
            createAutoMap(mapper, User, UserResponseDto)
        }
    }
}
