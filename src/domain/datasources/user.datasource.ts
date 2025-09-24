import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UpdateUserDto } from "../dtos/auth/update-user.dto";

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface UserFilters {
    roles?: string[];
    isActive?: boolean;
    search?: string; // buscar por nome ou email
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export abstract class UserDatasource {
    abstract create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserEntity>;
    abstract getAll(
        filters?: UserFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>>;
    abstract getById(id: string): Promise<UserEntity | null>;
    abstract getByEmail(email: string): Promise<UserEntity | null>;
    abstract update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    abstract delete(id: string): Promise<boolean>;
}