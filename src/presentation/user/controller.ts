import { Request, Response } from "express";
import {
    UserRepository,
    CreateUserDto,
    UpdateUserDto,
    CustomError,
    PaginationOptions,
    UserFilters
} from "../../domain";
import {
    CreateUser,
    GetUsers,
    GetUser,
    UpdateUser,
    DeleteUser
} from "../../domain/use-cases/user";

export class UserController {
    // DI
    constructor(private readonly userRepository: UserRepository) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    };

    private getCurrentUserInfo = (req: Request) => {
        const user = req.body.user;
        return {
            id: user._id || user.id,
            roles: user.roles || []
        };
    };

    createUser = (req: Request, res: Response) => {
        const [error, createUserDto] = CreateUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        const { id: currentUserId, roles: currentUserRoles } = this.getCurrentUserInfo(req);

        new CreateUser(this.userRepository)
            .execute(createUserDto!, currentUserRoles, currentUserId)
            .then((data) => res.status(201).json(data))
            .catch((error) => this.handleError(error, res));
    };

    getUsers = (req: Request, res: Response) => {
        const { roles, isActive, search, page, limit } = req.query;

        // Preparar filtros
        const filters: UserFilters = {};
        if (roles) {
            filters.roles = Array.isArray(roles) ? roles as string[] : [roles as string];
        }
        if (isActive !== undefined) {
            filters.isActive = isActive === 'true';
        }
        if (search) {
            filters.search = search as string;
        }

        // Preparar paginação
        const pagination: PaginationOptions = {
            page: parseInt(page as string) || 1,
            limit: parseInt(limit as string) || 10
        };

        const { roles: currentUserRoles } = this.getCurrentUserInfo(req);

        new GetUsers(this.userRepository)
            .execute(currentUserRoles, filters, pagination)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };

    getUser = (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: currentUserId, roles: currentUserRoles } = this.getCurrentUserInfo(req);

        new GetUser(this.userRepository)
            .execute(id, currentUserRoles, currentUserId)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };

    updateUser = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateUserDto] = UpdateUserDto.create(req.body);

        if (error) return res.status(400).json({ error });

        const { id: currentUserId, roles: currentUserRoles } = this.getCurrentUserInfo(req);

        new UpdateUser(this.userRepository)
            .execute(id, updateUserDto!, currentUserRoles, currentUserId)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };

    deleteUser = (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: currentUserId, roles: currentUserRoles } = this.getCurrentUserInfo(req);

        new DeleteUser(this.userRepository)
            .execute(id, currentUserRoles, currentUserId)
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    };
}