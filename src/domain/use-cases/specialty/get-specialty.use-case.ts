import { SpecialtyRepository, SpecialtyEntity, CustomError } from "../..";

interface GetSpecialtyUseCase {
    execute(id: string): Promise<SpecialtyEntity>;
}

export class GetSpecialty implements GetSpecialtyUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(id: string): Promise<SpecialtyEntity> {
        try {
            if (!id) {
                throw CustomError.badRequest('Specialty ID is required');
            }

            const specialty = await this.specialtyRepository.getById(id);

            if (!specialty) {
                throw CustomError.notfound('Specialty not found');
            }

            return specialty;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching specialty');
        }
    }
}