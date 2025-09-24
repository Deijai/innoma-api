import {
    SpecialtyRepository,
    CustomError,
    PaginationOptions,
    SpecialtyFilters,
    PaginatedResult,
    SpecialtyEntity
} from "../..";

interface GetSpecialtiesUseCase {
    execute(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>>;
}

export class GetSpecialties implements GetSpecialtiesUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>> {
        try {
            // Definir valores padrão
            const defaultPagination: PaginationOptions = {
                page: 1,
                limit: 10,
                ...pagination
            };

            const defaultFilters: SpecialtyFilters = {
                isActive: true, // Por padrão, mostrar apenas ativas
                ...filters
            };

            const result = await this.specialtyRepository.getAll(defaultFilters, defaultPagination);
            return result;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching specialties');
        }
    }
}