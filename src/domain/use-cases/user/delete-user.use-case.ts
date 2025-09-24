import { UserRepository, CustomError, USER_ROLES } from "../..";

interface DeleteUserUseCase {
    execute(
        id: string,
        currentUserRoles: string[],
        currentUserId: string
    ): Promise<{ success: boolean; message: string }>;
}

export class DeleteUser implements DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        id: string,
        currentUserRoles: string[],
        currentUserId: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            if (!id) {
                throw CustomError.badRequest('User ID is required');
            }

            // Não pode deletar a si mesmo
            if (id === currentUserId) {
                throw CustomError.badRequest("Cannot delete yourself");
            }

            // Buscar usuário existente
            const existingUser = await this.userRepository.getById(id);
            if (!existingUser) {
                throw CustomError.notfound('User not found');
            }

            // Validar permissões
            this.validateDeletePermissions(existingUser, currentUserRoles);

            const success = await this.userRepository.delete(id);

            if (!success) {
                throw CustomError.internalServer('Failed to delete user');
            }

            return {
                success: true,
                message: 'User deleted successfully'
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error deleting user');
        }
    }

    private validateDeletePermissions(targetUser: any, currentUserRoles: string[]) {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);

        // Apenas ADMIN pode deletar usuários
        if (!isAdmin) {
            throw CustomError.forbidden("Only ADMIN can delete users");
        }

        // ADMIN não pode deletar outro ADMIN (proteção adicional)
        const isTargetAdmin = targetUser.roles.includes(USER_ROLES.ADMIN);
        if (isTargetAdmin) {
            throw CustomError.forbidden("Cannot delete another ADMIN user");
        }
    }
}