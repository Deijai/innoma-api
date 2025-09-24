import { UserModel, SpecialtyModel } from "../mongodb";
import { ADMIN_SEED, SPECIALTIES_SEED } from "./seed-data";

export class SeedRunner {

    static async run() {
        console.log("🌱 Starting seeds...");

        try {
            await this.createAdminUser();
            await this.createSpecialties();

            console.log("✅ Seeds completed successfully!");
        } catch (error) {
            console.error("❌ Error running seeds:", error);
            throw error;
        }
    }

    private static async createAdminUser() {
        console.log("👤 Checking admin user...");

        // Verifica se já existe um admin
        const adminExists = await UserModel.findOne({
            email: ADMIN_SEED.email
        });

        if (adminExists) {
            console.log("ℹ️  Admin user already exists");
            return;
        }

        // Cria o admin
        const admin = new UserModel(ADMIN_SEED);
        await admin.save();

        console.log("✅ Admin user created successfully");
        console.log(`   📧 Email: ${ADMIN_SEED.email}`);
        console.log(`   🔑 Password: admin123`);
    }

    private static async createSpecialties() {
        console.log("🏥 Checking specialties...");

        let createdCount = 0;
        let existingCount = 0;

        for (const specialtyData of SPECIALTIES_SEED) {
            // Verifica se a especialidade já existe
            const exists = await SpecialtyModel.findOne({
                name: specialtyData.name
            });

            if (exists) {
                existingCount++;
                continue;
            }

            // Cria a especialidade
            const specialty = new SpecialtyModel(specialtyData);
            await specialty.save();
            createdCount++;
        }

        console.log(`✅ Specialties processed:`);
        console.log(`   📋 Created: ${createdCount}`);
        console.log(`   ℹ️  Already existed: ${existingCount}`);
    }
}