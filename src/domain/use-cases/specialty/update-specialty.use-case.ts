import { SpecialtyRepository, SpecialtyEntity, UpdateSpecialtyDto, CustomError } from "../..";

interface UpdateSpecialtyUseCase {
    execute(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity>;
}

export class UpdateSpecialty implements UpdateSpecialtyUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity> {
        try {
            if (!id) {
                throw CustomError.badRequest('Specialty ID is required');
            }

            const specialty = await this.specialtyRepository.update(id, updateSpecialtyDto);
            return specialty;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error updating specialty');
        }
    }
}