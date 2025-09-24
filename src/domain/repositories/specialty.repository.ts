import { SpecialtyEntity } from "../entities/specialty.entity";
import { CreateSpecialtyDto } from "../dtos/specialty/create-specialty.dto";
import { UpdateSpecialtyDto } from "../dtos/specialty/update-specialty.dto";
import { SpecialtyFilters } from "../datasources/specialty.datasource";
import { PaginatedResult, PaginationOptions } from "../datasources/user.datasource";
// import { PaginationOptions, SpecialtyFilters, PaginatedResult } from "../datasources/specialty.datasource";

export abstract class SpecialtyRepository {
    abstract create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity>;
    abstract getAll(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>>;
    abstract getById(id: string): Promise<SpecialtyEntity | null>;
    abstract update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity>;
    abstract delete(id: string): Promise<boolean>;
}