import { SpecialtyRepository, CustomError } from "../..";

interface DeleteSpecialtyUseCase {
    execute(id: string): Promise<{ success: boolean; message: string }>;
}

export class DeleteSpecialty implements DeleteSpecialtyUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(id: string): Promise<{ success: boolean; message: string }> {
        try {
            if (!id) {
                throw CustomError.badRequest('Specialty ID is required');
            }

            // Verificar se existe antes de deletar
            const specialty = await this.specialtyRepository.getById(id);
            if (!specialty) {
                throw CustomError.notfound('Specialty not found');
            }

            const success = await this.specialtyRepository.delete(id);

            if (!success) {
                throw CustomError.internalServer('Failed to delete specialty');
            }

            return {
                success: true,
                message: 'Specialty deleted successfully'
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error deleting specialty');
        }
    }
}