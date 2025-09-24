import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { UpdateUserDto } from "../dtos/auth/update-user.dto";
import { PaginationOptions, UserFilters, PaginatedResult } from "../datasources/user.datasource";

export abstract class UserRepository {
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