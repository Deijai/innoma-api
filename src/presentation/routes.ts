import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { SpecialtyRoutes } from "./specialty/routes";
import { UserRoutes } from "./user/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir todas as rotas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/specialties', SpecialtyRoutes.routes);
    router.use('/api/users', UserRoutes.routes);

    return router;
  }
}