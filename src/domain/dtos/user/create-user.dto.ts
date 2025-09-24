import { Validators } from "../../../config/validators";
import { USER_ROLES, UserRole } from "../../constants/user-roles.constants";

export class CreateUserDto {
    private constructor(
        public name: string,
        public email: string,
        public password: string,
        public roles: UserRole[],
        public phone?: string,
        public img?: string,

        // Campos específicos para DOCTOR
        public specialties?: string[],
        public crm?: string,

        // Campos específicos para PATIENT
        public birthDate?: Date,
        public cpf?: string,
        public address?: {
            street?: string;
            number?: string;
            complement?: string;
            neighborhood?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        }
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateUserDto?] {
        const {
            name,
            email,
            password,
            roles,
            phone,
            img,
            specialties,
            crm,
            birthDate,
            cpf,
            address
        } = object;

        // Validações básicas obrigatórias
        if (!name) return ["Missing name", undefined];
        if (name.length < 2) return ["Name too short", undefined];
        if (!email) return ["Missing email", undefined];
        if (!Validators.email.test(email)) return ["Invalid email", undefined];
        if (!password) return ["Missing password", undefined];
        if (password.length < 6) return ["Password too short", undefined];

        // Validar roles
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            return ["At least one role is required", undefined];
        }

        const validRoles = Object.values(USER_ROLES);
        const invalidRoles = roles.filter((role: string) => !validRoles.includes(role as UserRole));
        if (invalidRoles.length > 0) {
            return [`Invalid roles: ${invalidRoles.join(', ')}`, undefined];
        }

        // ✅ CORREÇÃO: Verificar se especialidades foram fornecidas para usuário que NÃO é DOCTOR
        const isDoctor = roles.includes(USER_ROLES.DOCTOR);

        if (!isDoctor && specialties && specialties.length > 0) {
            return ["Only DOCTOR users can have specialties", undefined];
        }

        if (!isDoctor && crm) {
            return ["Only DOCTOR users can have CRM", undefined];
        }

        // Validações específicas para DOCTOR
        if (isDoctor) {
            if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
                return ["DOCTOR must have at least one specialty", undefined];
            }

            // Validar formato dos IDs das especialidades
            const invalidSpecialties = specialties.filter(id =>
                typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)
            );
            if (invalidSpecialties.length > 0) {
                return ["Invalid specialty IDs format", undefined];
            }
        }

        // Validações opcionais
        if (phone && (phone.length < 10 || phone.length > 15)) {
            return ["Invalid phone number", undefined];
        }

        if (cpf) {
            if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
                return ["Invalid CPF format", undefined];
            }
        }

        // Validar birthDate
        let parsedBirthDate: Date | undefined;
        if (birthDate) {
            parsedBirthDate = new Date(birthDate);
            if (isNaN(parsedBirthDate.getTime())) {
                return ["Invalid birth date", undefined];
            }

            if (parsedBirthDate > new Date()) {
                return ["Birth date cannot be in the future", undefined];
            }
        }

        return [undefined, new CreateUserDto(
            name.trim(),
            email.toLowerCase().trim(),
            password,
            roles,
            phone?.trim(),
            img?.trim(),
            isDoctor ? specialties : undefined, // ✅ Só passa specialties se for DOCTOR
            isDoctor ? crm?.trim() : undefined,  // ✅ Só passa CRM se for DOCTOR
            parsedBirthDate,
            cpf?.trim(),
            address
        )];
    }
}