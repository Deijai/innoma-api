import { UserRepository, UserEntity, UpdateUserDto, CustomError, USER_ROLES } from "../..";

interface UpdateUserUseCase {
    execute(
        id: string,
        updateUserDto: UpdateUserDto,
        currentUserRoles: string[],
        currentUserId: string
    ): Promise<UserEntity>;
}

export class UpdateUser implements UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        id: string,
        updateUserDto: UpdateUserDto,
        currentUserRoles: string[],
        currentUserId: string
    ): Promise<UserEntity> {
        try {
            if (!id) {
                throw CustomError.badRequest('User ID is required');
            }

            // Buscar usuário existente
            const existingUser = await this.userRepository.getById(id);
            if (!existingUser) {
                throw CustomError.notfound('User not found');
            }

            // Validar permissões para atualizar
            this.validateUpdatePermissions(
                existingUser,
                updateUserDto,
                currentUserRoles,
                currentUserId
            );

            const updatedUser = await this.userRepository.update(id, updateUserDto);

            // Remover senha do resultado
            return {
                ...updatedUser,
                password: undefined as any
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error updating user');
        }
    }

    private validateUpdatePermissions(
        targetUser: UserEntity,
        updateData: UpdateUserDto,
        currentUserRoles: string[],
        currentUserId: string
    ) {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);
        const isUpdatingSelf = targetUser.id === currentUserId;

        // ADMIN pode atualizar qualquer usuário
        if (isAdmin) {
            return;
        }

        // Usuário pode atualizar a si mesmo (com limitações)
        if (isUpdatingSelf) {
            // Não pode alterar seus próprios roles
            if (updateData.roles) {
                throw CustomError.forbidden("Cannot change your own roles");
            }

            // Não pode alterar isActive
            if (updateData.isActive !== undefined) {
                throw CustomError.forbidden("Cannot change your own active status");
            }

            return;
        }

        // USER pode atualizar apenas PATIENT
        const isUser = currentUserRoles.includes(USER_ROLES.USER);
        if (isUser) {
            const isTargetPatient = targetUser.roles.includes(USER_ROLES.PATIENT);
            if (isTargetPatient) {
                // USER não pode alterar roles de PATIENT
                if (updateData.roles) {
                    throw CustomError.forbidden("Cannot change patient roles");
                }
                return;
            }

            throw CustomError.forbidden("USER can only update PATIENT users");
        }

        // DOCTOR e PATIENT não podem atualizar outros usuários
        throw CustomError.forbidden("Insufficient permissions to update this user");
    }
}