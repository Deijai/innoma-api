import { SpecialtyEntity } from "../entities/specialty.entity";
import { CreateSpecialtyDto } from "../dtos/specialty/create-specialty.dto";
import { UpdateSpecialtyDto } from "../dtos/specialty/update-specialty.dto";

export abstract class SpecialtyDatasource {
    abstract create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity>;
    abstract getAll(isActiveOnly?: boolean): Promise<SpecialtyEntity[]>;
    abstract getById(id: string): Promise<SpecialtyEntity | null>;
    abstract update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity>;
    abstract delete(id: string): Promise<boolean>;
}