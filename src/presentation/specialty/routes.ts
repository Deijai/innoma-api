import { Router } from "express";
import { SpecialtyController } from "./controller";
import { SpecialtyDatasourceImpl, SpecialtyRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RoleMiddleware } from "../middlewares/role.middleware";

export class SpecialtyRoutes {
    static get routes(): Router {
        const router = Router();

        // Dependency Injection
        const datasource = new SpecialtyDatasourceImpl();
        const specialtyRepository = new SpecialtyRepositoryImpl(datasource);
        const controller = new SpecialtyController(specialtyRepository);

        // Todas as rotas precisam de autenticação
        router.use(AuthMiddleware.validateJWT);

        // GET /specialties - Listar especialidades (todos podem ver)
        router.get("/", controller.getSpecialties);

        // GET /specialties/:id - Buscar especialidade por ID (todos podem ver)
        router.get("/:id", controller.getSpecialty);

        // POST /specialties - Criar especialidade (apenas ADMIN)
        router.post("/", RoleMiddleware.adminOnly, controller.createSpecialty);

        // PUT /specialties/:id - Atualizar especialidade (apenas ADMIN)
        router.put("/:id", RoleMiddleware.adminOnly, controller.updateSpecialty);

        // DELETE /specialties/:id - Deletar especialidade (apenas ADMIN)
        router.delete("/:id", RoleMiddleware.adminOnly, controller.deleteSpecialty);

        return router;
    }
}