import {
    UserRepository,
    CustomError,
    PaginationOptions,
    UserFilters,
    PaginatedResult,
    UserEntity,
    USER_ROLES
} from "../..";

interface GetDoctorsBySpecialtyUseCase {
    execute(
        specialtyId: string,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>>;
}

export class GetDoctorsBySpecialty implements GetDoctorsBySpecialtyUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        specialtyId: string,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>> {
        try {
            if (!specialtyId) {
                throw CustomError.badRequest('Specialty ID is required');
            }

            // Validar formato do ObjectId
            if (!/^[0-9a-fA-F]{24}$/.test(specialtyId)) {
                throw CustomError.badRequest('Invalid specialty ID format');
            }

            // Criar filtros específicos para buscar médicos com essa especialidade
            const filters: UserFilters = {
                roles: [USER_ROLES.DOCTOR],
                isActive: true,
                specialties: [specialtyId] // Novo filtro que vamos implementar
            };

            const result = await this.userRepository.getAll(filters, pagination);

            // Remover senha dos resultados
            result.data = result.data.map(user => ({
                ...user,
                password: undefined as any
            }));

            return result;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching doctors by specialty');
        }
    }
}