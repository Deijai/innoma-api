import { SpecialtyRepository, SpecialtyEntity, CreateSpecialtyDto, CustomError } from "../..";

interface CreateSpecialtyUseCase {
    execute(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity>;
}

export class CreateSpecialty implements CreateSpecialtyUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity> {
        try {
            const specialty = await this.specialtyRepository.create(createSpecialtyDto, createdBy);
            return specialty;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error creating specialty');
        }
    }
}