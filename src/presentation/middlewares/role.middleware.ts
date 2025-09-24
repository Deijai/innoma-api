import { NextFunction, Request, Response } from "express";
import { USER_ROLES, UserRole } from "../../domain";

export class RoleMiddleware {

    static hasRole(...requiredRoles: UserRole[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = req.body.user;

                if (!user) {
                    return res.status(401).json({
                        error: "User not authenticated"
                    });
                }

                const userRoles = user.roles || [];

                // Verificar se o usuário tem pelo menos um dos roles necessários
                const hasPermission = requiredRoles.some(requiredRole =>
                    userRoles.includes(requiredRole)
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        error: "Insufficient permissions",
                        required: requiredRoles,
                        userRoles: userRoles
                    });
                }

                next();
            } catch (error) {
                console.error('Role validation error:', error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        };
    }

    // Middleware específico para ADMIN
    static adminOnly = RoleMiddleware.hasRole(USER_ROLES.ADMIN);

    // Middleware específico para ADMIN ou USER
    static adminOrUser = RoleMiddleware.hasRole(USER_ROLES.ADMIN, USER_ROLES.USER);

    // Middleware específico para médicos
    static doctorOnly = RoleMiddleware.hasRole(USER_ROLES.DOCTOR);

    // Middleware que permite ADMIN, USER ou DOCTOR
    static staffOnly = RoleMiddleware.hasRole(
        USER_ROLES.ADMIN,
        USER_ROLES.USER,
        USER_ROLES.DOCTOR
    );
}