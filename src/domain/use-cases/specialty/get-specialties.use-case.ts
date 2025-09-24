import { SpecialtyRepository, SpecialtyEntity, CustomError } from "../..";

interface GetSpecialtiesUseCase {
    execute(isActiveOnly?: boolean): Promise<SpecialtyEntity[]>;
}

export class GetSpecialties implements GetSpecialtiesUseCase {
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    async execute(isActiveOnly: boolean = true): Promise<SpecialtyEntity[]> {
        try {
            const specialties = await this.specialtyRepository.getAll(isActiveOnly);
            return specialties;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching specialties');
        }
    }
}