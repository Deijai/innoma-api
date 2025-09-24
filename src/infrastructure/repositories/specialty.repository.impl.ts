import {
    SpecialtyRepository,
    SpecialtyDatasource,
    SpecialtyEntity,
    CreateSpecialtyDto,
    UpdateSpecialtyDto,
    PaginationOptions,
    SpecialtyFilters,
    PaginatedResult
} from "../../domain";

export class SpecialtyRepositoryImpl implements SpecialtyRepository {
    constructor(private readonly datasource: SpecialtyDatasource) { }

    create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity> {
        return this.datasource.create(createSpecialtyDto, createdBy);
    }

    getAll(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>> {
        return this.datasource.getAll(filters, pagination);
    }

    getById(id: string): Promise<SpecialtyEntity | null> {
        return this.datasource.getById(id);
    }

    update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity> {
        return this.datasource.update(id, updateSpecialtyDto);
    }

    delete(id: string): Promise<boolean> {
        return this.datasource.delete(id);
    }
}