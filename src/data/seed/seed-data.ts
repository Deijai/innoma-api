import { BcryptAdapter } from "../../config";
import { USER_ROLES } from "../../domain";

export const ADMIN_SEED = {
    name: "Administrador",
    email: "admin@sistema.com",
    password: BcryptAdapter.hash("admin123"),
    roles: [USER_ROLES.ADMIN],
    isActive: true,
};

export const SPECIALTIES_SEED = [
    {
        name: "Cardiologia",
        description: "Especialidade médica dedicada ao estudo, diagnóstico e tratamento das doenças do coração",
        isActive: true,
    },
    {
        name: "Dermatologia",
        description: "Especialidade médica dedicada ao estudo da pele e seus anexos",
        isActive: true,
    },
    {
        name: "Pediatria",
        description: "Especialidade médica dedicada à assistência à criança e ao adolescente",
        isActive: true,
    },
    {
        name: "Ginecologia",
        description: "Especialidade médica dedicada ao cuidado do sistema reprodutor feminino",
        isActive: true,
    },
    {
        name: "Ortopedia",
        description: "Especialidade médica que cuida do sistema locomotor",
        isActive: true,
    },
    {
        name: "Clínica Geral",
        description: "Especialidade médica que aborda de forma integral e continuada o indivíduo",
        isActive: true,
    },
    {
        name: "Psiquiatria",
        description: "Especialidade médica dedicada ao estudo, prevenção, diagnóstico e tratamento de transtornos mentais",
        isActive: true,
    }
];