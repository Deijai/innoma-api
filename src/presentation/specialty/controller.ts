import { Request, Response } from "express";
import {
    SpecialtyRepository,
    CreateSpecialtyDto,
    UpdateSpecialtyDto,
    CustomError
} from "../../domain";
import {
    CreateSpecialty,
    GetSpecialties,
    GetSpecialty,
    UpdateSpecialty,
    DeleteSpecialty
} from "../../domain/use-cases/specialty";

export class SpecialtyController {
    // DI
    constructor(private readonly specialtyRepository: SpecialtyRepository) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    };

    createSpecialty = (req: Request, res: Response) => {
        const [error, createSpecialtyDto] = CreateSpecialtyDto.create(req.body);

        if (error) return res.status(400).json({ error });

        const createdBy = req.body.user?._id || req.body.user?.id;

        new CreateSpecialty(this.specialtyRepository)
            .execute(createSpecialtyDto!, createdBy)
            .then((data) => res.status(201).json(data))
            .catch((error) => this.handleError(error, res));
    };

    getSpecialties = (req: Request, res: Response) => {
        const { includeInactive } = req.query;
        const isActiveOnly = includeInactive !== 'true';

        new GetSpecialties(this.specialtyRepository)
            .execute(isActiveOnly)
            .then((data) => res.json({ specialties: data, total: data.length }))
            .catch((error) => this.handleError(error, res));
    };

    getSpecialty = (req: Request, res: Response) => {
        const { id } = req.params;

        new GetSpecialty(this.specialtyRepository)
            .execute(id)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };

    updateSpecialty = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateSpecialtyDto] = UpdateSpecialtyDto.create(req.body);

        if (error) return res.status(400).json({ error });

        new UpdateSpecialty(this.specialtyRepository)
            .execute(id, updateSpecialtyDto!)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };

    deleteSpecialty = (req: Request, res: Response) => {
        const { id } = req.params;

        new DeleteSpecialty(this.specialtyRepository)
            .execute(id)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };
}