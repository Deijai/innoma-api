import {
    UserRepository,
    CustomError,
    PaginationOptions,
    UserFilters,
    PaginatedResult,
    UserEntity,
    USER_ROLES
} from "../..";

interface GetUsersUseCase {
    execute(
        currentUserRoles: string[],
        filters?: UserFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>>;
}

export class GetUsers implements GetUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        currentUserRoles: string[],
        filters?: UserFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>> {
        try {
            // Validar permissões
            this.validateViewPermissions(currentUserRoles);

            // Aplicar filtros baseados no role do usuário atual
            const adjustedFilters = this.adjustFiltersBasedOnRole(currentUserRoles, filters);

            const result = await this.userRepository.getAll(adjustedFilters, pagination);

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
            throw CustomError.internalServer('Error fetching users');
        }
    }

    private validateViewPermissions(currentUserRoles: string[]) {
        const canView = currentUserRoles.some(role =>
            [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.DOCTOR].includes(role as any)
        );

        if (!canView) {
            throw CustomError.forbidden("Insufficient permissions to view users");
        }
    }

    private adjustFiltersBasedOnRole(
        currentUserRoles: string[],
        filters?: UserFilters
    ): UserFilters {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);

        // ADMIN pode ver todos os usuários
        if (isAdmin) {
            return filters || {};
        }

        // USER e DOCTOR podem ver apenas usuários PATIENT e outros USER/DOCTOR
        const allowedRoles = [USER_ROLES.PATIENT, USER_ROLES.USER, USER_ROLES.DOCTOR];

        return {
            ...filters,
            roles: filters?.roles ?
                filters.roles.filter(role => allowedRoles.includes(role as any)) :
                allowedRoles
        };
    }
}