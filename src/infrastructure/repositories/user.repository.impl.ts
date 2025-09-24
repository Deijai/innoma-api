import {
    UserRepository,
    UserDatasource,
    UserEntity,
    CreateUserDto,
    UpdateUserDto,
    PaginationOptions,
    UserFilters,
    PaginatedResult
} from "../../domain";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly datasource: UserDatasource) { }

    create(createUserDto: CreateUserDto, createdBy?: string): Promise<UserEntity> {
        return this.datasource.create(createUserDto, createdBy);
    }

    getAll(
        filters?: UserFilters,
        pagination?: PaginationOptions
    ): Promise<PaginatedResult<UserEntity>> {
        return this.datasource.getAll(filters, pagination);
    }

    getById(id: string): Promise<UserEntity | null> {
        return this.datasource.getById(id);
    }

    getByEmail(email: string): Promise<UserEntity | null> {
        return this.datasource.getByEmail(email);
    }

    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        return this.datasource.update(id, updateUserDto);
    }

    delete(id: string): Promise<boolean> {
        return this.datasource.delete(id);
    }
}