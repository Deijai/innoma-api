import { UserModel, SpecialtyModel } from "../../data/mongodb";
import {
    UserDatasource,
    UserEntity,
    CreateUserDto,
    UpdateUserDto,
    CustomError,
    PaginationOptions,
    UserFilters,
    PaginatedResult,
    USER_ROLES
} from "../../domain";
import { UserMapper } from "../mappers/user.mapper";
import { BcryptAdapter } from "../../config";

export class UserDatasourceImpl implements UserDatasource {

    async create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserEntity> {
        const {
            name,
            email,
            password,
            roles,
            specialties,
            crm,
            ...otherFields
        } = createUserDto;

        try {
            // Verificar se email já existe
            const emailExists = await UserModel.findOne({ email });
            if (emailExists) {
                throw CustomError.badRequest("Email already exists");
            }

            const isDoctor = roles.includes(USER_ROLES.DOCTOR);

            // ✅ NOVO: Verificar se CRM já existe (apenas para DOCTOR)
            if (isDoctor && crm) {
                const crmExists = await UserModel.findOne({
                    crm: crm.trim(),
                    isActive: true
                });

                if (crmExists) {
                    throw CustomError.badRequest("CRM already exists");
                }
            }

            // ✅ CORREÇÃO: Verificar especialidades apenas se for DOCTOR
            if (isDoctor && specialties && specialties.length > 0) {
                const existingSpecialties = await SpecialtyModel.find({
                    _id: { $in: specialties },
                    isActive: true
                });

                if (existingSpecialties.length !== specialties.length) {
                    throw CustomError.badRequest("One or more specialties not found or inactive");
                }
            }

            // Criar o usuário
            const userData: any = {
                name,
                email,
                password: BcryptAdapter.hash(password),
                roles,
                createdBy: createdBy || null,
                ...otherFields
            };

            // ✅ CORREÇÃO: Só adicionar specialties e crm se for DOCTOR
            if (isDoctor) {
                userData.specialties = specialties || [];
                if (crm) {
                    userData.crm = crm.trim();
                }
            }

            const user = await UserModel.create(userData);

            // Populate das especialidades e do criador
            await user.populate([
                { path: 'specialties', select: 'name description' },
                { path: 'createdBy', select: 'name email' }
            ]);

            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }

    async getAll(
        filters?: UserFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>> {
        try {
            const { roles, isActive, search, specialties } = filters || {};
            const { page = 1, limit = 10 } = pagination || {};

            // Construir filtros de busca
            const query: any = {};

            if (roles && roles.length > 0) {
                query.roles = { $in: roles };
            }

            if (isActive !== undefined) {
                query.isActive = isActive;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            // ✅ NOVO: Filtrar por especialidades
            if (specialties && specialties.length > 0) {
                query.specialties = { $in: specialties };
            }

            // Calcular skip para paginação
            const skip = (page - 1) * limit;

            // Buscar usuários
            const [users, total] = await Promise.all([
                UserModel.find(query)
                    .populate('specialties', 'name description')
                    .populate('createdBy', 'name email')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                UserModel.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: users.map(user => UserMapper.userEntityFromObject(user)),
                total,
                page,
                limit,
                totalPages
            };

        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async getById(id: string): Promise<UserEntity | null> {
        try {
            const user = await UserModel.findById(id)
                .populate('specialties', 'name description')
                .populate('createdBy', 'name email');

            if (!user) {
                return null;
            }

            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        try {
            const user = await UserModel.findOne({ email })
                .populate('specialties', 'name description')
                .populate('createdBy', 'name email');

            if (!user) {
                return null;
            }

            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            throw CustomError.internalServer();
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const {
            email,
            password,
            specialties,
            roles,
            crm,
            ...otherFields
        } = updateUserDto;

        try {
            // Verificar se o usuário existe
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                throw CustomError.notfound("User not found");
            }

            // Verificar se email já existe (se estiver sendo alterado)
            if (email && email !== existingUser.email) {
                const emailExists = await UserModel.findOne({
                    email,
                    _id: { $ne: id }
                });
                if (emailExists) {
                    throw CustomError.badRequest("Email already exists");
                }
            }

            // Determinar se o usuário será DOCTOR após a atualização
            const updatedRoles = roles || existingUser.roles;
            const willBeDoctor = updatedRoles.includes(USER_ROLES.DOCTOR);
            const wasDoctor = existingUser.roles.includes(USER_ROLES.DOCTOR);

            // ✅ NOVO: Verificar se CRM já existe (apenas para DOCTOR)
            if (willBeDoctor && crm && crm !== existingUser.crm) {
                const crmExists = await UserModel.findOne({
                    crm: crm.trim(),
                    _id: { $ne: id },
                    isActive: true
                });

                if (crmExists) {
                    throw CustomError.badRequest("CRM already exists");
                }
            }

            // ✅ CORREÇÃO: Validar especialidades baseado no role
            if (willBeDoctor) {
                // Se vai ser DOCTOR, deve ter especialidades
                const updatedSpecialties = specialties !== undefined ? specialties : existingUser.specialties;
                if (!updatedSpecialties || updatedSpecialties.length === 0) {
                    throw CustomError.badRequest("DOCTOR must have at least one specialty");
                }

                // Verificar se especialidades existem e estão ativas
                if (specialties && specialties.length > 0) {
                    const existingSpecialties = await SpecialtyModel.find({
                        _id: { $in: specialties },
                        isActive: true
                    });

                    if (existingSpecialties.length !== specialties.length) {
                        throw CustomError.badRequest("One or more specialties not found or inactive");
                    }
                }
            } else {
                // Se NÃO vai ser DOCTOR, não pode ter especialidades ou CRM
                if (specialties && specialties.length > 0) {
                    throw CustomError.badRequest("Only DOCTOR users can have specialties");
                }
                if (crm) {
                    throw CustomError.badRequest("Only DOCTOR users can have CRM");
                }
            }

            // Preparar dados para atualização
            const updateData: any = { ...otherFields };

            if (email) updateData.email = email;
            if (password) updateData.password = BcryptAdapter.hash(password);
            if (roles) updateData.roles = roles;

            // ✅ CORREÇÃO: Tratar especialidades e CRM baseado no role
            if (willBeDoctor) {
                // Se é DOCTOR, pode atualizar specialties e CRM
                if (specialties !== undefined) updateData.specialties = specialties;
                if (crm !== undefined) updateData.crm = crm;
            } else {
                // Se não é DOCTOR, remover specialties e CRM
                if (wasDoctor) {
                    updateData.specialties = [];
                    updateData.crm = null;
                }
            }

            // Atualizar usuário
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            )
                .populate('specialties', 'name description')
                .populate('createdBy', 'name email');

            return UserMapper.userEntityFromObject(updatedUser!);

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
            const result = await UserModel.findByIdAndUpdate(
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