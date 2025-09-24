import { UserRepository, CustomError } from "../..";
import { Validators } from "../../../config";

interface CheckEmailResult {
    email: string;
    available: boolean;
    message: string;
}

interface CheckEmailUseCase {
    execute(email: string): Promise<CheckEmailResult>;
}

export class CheckEmail implements CheckEmailUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(email: string): Promise<CheckEmailResult> {
        try {
            // Validações básicas
            if (!email) {
                throw CustomError.badRequest('Email is required');
            }

            if (!Validators.email.test(email)) {
                throw CustomError.badRequest('Invalid email format');
            }

            // Normalizar email
            const normalizedEmail = email.toLowerCase().trim();

            // Verificar se o email já existe
            const existingUser = await this.userRepository.getByEmail(normalizedEmail);

            const available = !existingUser;

            return {
                email: normalizedEmail,
                available,
                message: available
                    ? 'Email is available'
                    : 'Email is already in use'
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error checking email availability');
        }
    }
}