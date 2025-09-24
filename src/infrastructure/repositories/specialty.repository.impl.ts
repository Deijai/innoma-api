import {
    SpecialtyRepository,
    SpecialtyDatasource,
    SpecialtyEntity,
    CreateSpecialtyDto,
    UpdateSpecialtyDto,
} from "../../domain";

export class SpecialtyRepositoryImpl implements SpecialtyRepository {
    constructor(private readonly datasource: SpecialtyDatasource) { }

    create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity> {
        return this.datasource.create(createSpecialtyDto, createdBy);
    }

    getAll(isActiveOnly?: boolean): Promise<SpecialtyEntity[]> {
        return this.datasource.getAll(isActiveOnly);
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