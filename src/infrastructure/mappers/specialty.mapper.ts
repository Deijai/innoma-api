import { CustomError } from "../../domain";
import { SpecialtyEntity } from "../../domain/entities/specialty.entity";

export class SpecialtyMapper {
    static specialtyEntityFromObject(object: { [key: string]: any }) {
        const {
            id,
            _id,
            name,
            description,
            isActive,
            createdAt,
            updatedAt,
            createdBy
        } = object;

        if (!_id && !id) {
            throw CustomError.badRequest("Missing id");
        }

        if (!name) throw CustomError.badRequest("Missing name");

        return new SpecialtyEntity(
            _id || id,
            name,
            description || "",
            isActive ?? true,
            createdAt,
            updatedAt,
            createdBy
        );
    }
}