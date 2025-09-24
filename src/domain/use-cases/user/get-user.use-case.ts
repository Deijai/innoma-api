import { UserRepository, UserEntity, CustomError, USER_ROLES } from "../..";

interface GetUserUseCase {
    execute(id: string, currentUserRoles: string[], currentUserId: string): Promise<UserEntity>;
}

export class GetUser implements GetUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string, currentUserRoles: string[], currentUserId: string): Promise<UserEntity> {
        try {
            if (!id) {
                throw CustomError.badRequest('User ID is required');
            }

            const user = await this.userRepository.getById(id);

            if (!user) {
                throw CustomError.notfound('User not found');
            }

            // Validar permissões para ver o usuário
            this.validateViewPermissions(user, currentUserRoles, currentUserId);

            // Remover senha do resultado
            return {
                ...user,
                password: undefined as any
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching user');
        }
    }

    private validateViewPermissions(
        targetUser: UserEntity,
        currentUserRoles: string[],
        currentUserId: string
    ) {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);
        const isViewingSelf = targetUser.id === currentUserId;

        // ADMIN pode ver qualquer usuário
        if (isAdmin) {
            return;
        }

        // Usuário pode ver a si mesmo
        if (isViewingSelf) {
            return;
        }

        // USER e DOCTOR podem ver PATIENT e outros USER/DOCTOR
        const canViewRole = currentUserRoles.some(role =>
            [USER_ROLES.USER, USER_ROLES.DOCTOR].includes(role as any)
        );

        const isViewingAllowedRole = targetUser.roles.some(role =>
            [USER_ROLES.PATIENT, USER_ROLES.USER, USER_ROLES.DOCTOR].includes(role as any)
        );

        if (canViewRole && isViewingAllowedRole) {
            return;
        }

        throw CustomError.forbidden("Insufficient permissions to view this user");
    }
}