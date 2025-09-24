export class UpdateSpecialtyDto {
    private constructor(
        public name?: string,
        public description?: string,
        public isActive?: boolean,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateSpecialtyDto?] {
        const { name, description, isActive } = object;

        // Pelo menos um campo deve ser fornecido
        if (!name && !description && isActive === undefined) {
            return ["At least one field must be provided", undefined];
        }

        // Validações
        if (name && name.length < 2) return ["Name too short", undefined];
        if (name && name.length > 100) return ["Name too long", undefined];
        if (description && description.length > 500) return ["Description too long", undefined];

        return [undefined, new UpdateSpecialtyDto(
            name?.trim(),
            description?.trim(),
            isActive
        )];
    }
}