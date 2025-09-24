export class SpecialtyEntity {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public isActive: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public createdBy?: string,
    ) { }
}