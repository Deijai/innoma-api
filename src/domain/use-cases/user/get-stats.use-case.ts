import { UserModel, SpecialtyModel } from "../../../data/mongodb";
import { CustomError, USER_ROLES } from "../..";

interface SystemStats {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    totalActiveUsers: number;
    totalInactiveUsers: number;
    totalSpecialties: number;
    totalActiveSpecialties: number;
    usersByRole: {
        [key: string]: number;
    };
}

interface GetStatsUseCase {
    execute(currentUserRoles: string[]): Promise<SystemStats>;
}

export class GetStats implements GetStatsUseCase {

    async execute(currentUserRoles: string[]): Promise<SystemStats> {
        try {
            // Validar permissões (apenas ADMIN pode ver estatísticas completas)
            this.validatePermissions(currentUserRoles);

            // Buscar estatísticas em paralelo
            const [
                totalUsers,
                totalActiveUsers,
                totalInactiveUsers,
                totalSpecialties,
                totalActiveSpecialties,
                usersByRole,
                doctorsCount,
                patientsCount
            ] = await Promise.all([
                UserModel.countDocuments({}),
                UserModel.countDocuments({ isActive: true }),
                UserModel.countDocuments({ isActive: false }),
                SpecialtyModel.countDocuments({}),
                SpecialtyModel.countDocuments({ isActive: true }),
                this.getUsersByRole(),
                UserModel.countDocuments({ roles: { $in: [USER_ROLES.DOCTOR] }, isActive: true }),
                UserModel.countDocuments({ roles: { $in: [USER_ROLES.PATIENT] }, isActive: true })
            ]);

            return {
                totalUsers,
                totalDoctors: doctorsCount,
                totalPatients: patientsCount,
                totalActiveUsers,
                totalInactiveUsers,
                totalSpecialties,
                totalActiveSpecialties,
                usersByRole
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Error fetching system stats');
        }
    }

    private async getUsersByRole(): Promise<{ [key: string]: number }> {
        const result = await UserModel.aggregate([
            { $match: { isActive: true } },
            { $unwind: '$roles' },
            {
                $group: {
                    _id: '$roles',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats: { [key: string]: number } = {};

        // Inicializar com todos os roles possíveis
        Object.values(USER_ROLES).forEach(role => {
            stats[role] = 0;
        });

        // Preencher com os dados reais
        result.forEach(item => {
            stats[item._id] = item.count;
        });

        return stats;
    }

    private validatePermissions(currentUserRoles: string[]) {
        const isAdmin = currentUserRoles.includes(USER_ROLES.ADMIN);

        if (!isAdmin) {
            throw CustomError.forbidden("Only ADMIN can access system statistics");
        }
    }
}