import { SpecialtyEntity } from "../entities/specialty.entity";
import { CreateSpecialtyDto } from "../dtos/specialty/create-specialty.dto";
import { UpdateSpecialtyDto } from "../dtos/specialty/update-specialty.dto";
import { PaginatedResult, PaginationOptions } from "./user.datasource";

// export interface PaginationOptions {
//     page: number;
//     limit: number;
// }

export interface SpecialtyFilters {
    isActive?: boolean;
    search?: string; // buscar por nome ou descrição
}

// export interface PaginatedResult<T> {
//     data: T[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
// }

export abstract class SpecialtyDatasource {
    abstract create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity>;
    abstract getAll(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>>;
    abstract getById(id: string): Promise<SpecialtyEntity | null>;
    abstract update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity>;
    abstract delete(id: string): Promise<boolean>;
}