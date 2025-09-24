import { SpecialtyModel } from "../../data/mongodb";
import {
    SpecialtyDatasource,
    SpecialtyEntity,
    CreateSpecialtyDto,
    UpdateSpecialtyDto,
    CustomError,
    PaginationOptions,
    SpecialtyFilters,
    PaginatedResult
} from "../../domain";
import { SpecialtyMapper } from "../mappers/specialty.mapper";

export class SpecialtyDatasourceImpl implements SpecialtyDatasource {

    async create(createSpecialtyDto: CreateSpecialtyDto, createdBy?: string): Promise<SpecialtyEntity> {
        const { name, description } = createSpecialtyDto;

        try {
            // Verificar se já existe uma especialidade com o mesmo nome
            const exists = await SpecialtyModel.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') } // Case insensitive
            });

            if (exists) {
                throw CustomError.badRequest("Specialty already exists");
            }

            // Criar a especialidade
            const specialty = await SpecialtyModel.create({
                name,
                description,
                createdBy: createdBy || null,
            });

            return SpecialtyMapper.specialtyEntityFromObject(specialty);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }

    async getAll(
        filters?: SpecialtyFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<SpecialtyEntity>> {
        try {
            const { isActive, search } = filters || {};
            const { page = 1, limit = 10 } = pagination || {};

            // Construir filtros de busca
            const query: any = {};

            if (isActive !== undefined) {
                query.isActive = isActive;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Calcular skip para paginação
            const skip = (page - 1) * limit;

            // Buscar especialidades
            const [specialties, total] = await Promise.all([
                SpecialtyModel.find(query)
                    .populate('createdBy', 'name email')
                    .sort({ name: 1 }) // Ordenar por nome
                    .skip(skip)
                    .limit(limit),
                SpecialtyModel.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: specialties.map(specialty =>
                    SpecialtyMapper.specialtyEntityFromObject(specialty)
                ),
                total,
                page,
                limit,
                totalPages
            };

        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async getById(id: string): Promise<SpecialtyEntity | null> {
        try {
            const specialty = await SpecialtyModel.findById(id)
                .populate('createdBy', 'name email');

            if (!specialty) {
                return null;
            }

            return SpecialtyMapper.specialtyEntityFromObject(specialty);

        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto): Promise<SpecialtyEntity> {
        const { name, description, isActive } = updateSpecialtyDto;

        try {
            // Verificar se a especialidade existe
            const exists = await SpecialtyModel.findById(id);
            if (!exists) {
                throw CustomError.notfound("Specialty not found");
            }

            // Se está alterando o nome, verificar se não existe outro com o mesmo nome
            if (name && name !== exists.name) {
                const nameExists = await SpecialtyModel.findOne({
                    name: { $regex: new RegExp(`^${name}$`, 'i') },
                    _id: { $ne: id } // Excluir o próprio registro
                });

                if (nameExists) {
                    throw CustomError.badRequest("Specialty name already exists");
                }
            }

            // Atualizar
            const updatedSpecialty = await SpecialtyModel.findByIdAndUpdate(
                id,
                {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(isActive !== undefined && { isActive }),
                },
                { new: true } // Retornar o documento atualizado
            ).populate('createdBy', 'name email');

            return SpecialtyMapper.specialtyEntityFromObject(updatedSpecialty!);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            // Soft delete - apenas marcar como inativo
            const result = await SpecialtyModel.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );

            return !!result;

        } catch (error) {
            throw CustomError.internalServer();
        }
    }
}