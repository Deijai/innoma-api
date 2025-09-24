import { UserRepository, UserEntity, CreateUserDto, CustomError, USER_ROLES } from "../..";

interface CreateUserUseCase {
    execute(
        createUserDto: CreateUserDto,
        currentUserRoles: string[],
        createdBy?: string
    ): Promise<UserEntity>;
}

export class CreateUser implements CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(
        createUserDto: CreateUserDto,
        currentUserRoles: string[],
        createdBy?: string
    ): Promise<UserEntity> {
        try {
            // Validar permissões para criar usuários
            this.validateCreatePermissions(currentUserRoles, createUserDto.roles);

            const user = await this.userRepository.create(createUserDto, createdBy);
            return user;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error creating user');
        }
    }

    private validateCreatePermissions(currentUserRoles: string[], targetRoles: string[]) {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);
        const isUser = currentUserRoles.includes(USER_ROLES.USER);

        // ADMIN pode criar qualquer usuário
        if (isAdmin) {
            return;
        }

        // USER pode criar apenas PATIENT
        if (isUser) {
            const canCreatePatientOnly = targetRoles.length === 1 &&
                targetRoles.includes(USER_ROLES.PATIENT);
            if (canCreatePatientOnly) {
                return;
            }

            throw CustomError.forbidden("USER can only create PATIENT users");
        }

        // DOCTOR e PATIENT não podem criar usuários
        throw CustomError.forbidden("Insufficient permissions to create users");
    }
}