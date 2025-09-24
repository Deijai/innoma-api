export class CreateSpecialtyDto {
    private constructor(
        public name: string,
        public description: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateSpecialtyDto?] {
        const { name, description } = object;

        if (!name) return ["Missing name", undefined];
        if (name.length < 2) return ["Name too short", undefined];
        if (name.length > 100) return ["Name too long", undefined];

        if (description && description.length > 500) {
            return ["Description too long", undefined];
        }

        return [undefined, new CreateSpecialtyDto(name.trim(), description?.trim() || "")];
    }
}