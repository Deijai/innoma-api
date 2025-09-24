import { Router } from "express";
import { UserController } from "./controller";
import { UserDatasourceImpl, UserRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RoleMiddleware } from "../middlewares/role.middleware";

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        // Dependency Injection
        const datasource = new UserDatasourceImpl();
        const userRepository = new UserRepositoryImpl(datasource);
        const controller = new UserController(userRepository);

        // Todas as rotas precisam de autenticação
        router.use(AuthMiddleware.validateJWT);

        // GET /users - Listar usuários (ADMIN, USER, DOCTOR podem ver)
        router.get("/", RoleMiddleware.staffOnly, controller.getUsers);

        // GET /users/:id - Buscar usuário por ID
        router.get("/:id", RoleMiddleware.staffOnly, controller.getUser);

        // POST /users - Criar usuário (ADMIN pode criar qualquer, USER só PATIENT)
        router.post("/", RoleMiddleware.adminOrUser, controller.createUser);

        // PUT /users/:id - Atualizar usuário
        router.put("/:id", RoleMiddleware.staffOnly, controller.updateUser);

        // DELETE /users/:id - Deletar usuário (apenas ADMIN)
        router.delete("/:id", RoleMiddleware.adminOnly, controller.deleteUser);

        return router;
    }
}