import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { BcryptAdapter } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const datasource = new AuthDatasourceImpl();

    const authRepository = new AuthRepositoryImpl(datasource);

    const controller = new AuthController(authRepository);

    //definir todos os controladores

    //Metodos GET
    router.get("/users", AuthMiddleware.validateJWT, controller.getUsers);

    //Metodos POST
    router.post("/signin", controller.signinUser);
    router.post("/register", controller.registerUser);

    return router;
  }
}
