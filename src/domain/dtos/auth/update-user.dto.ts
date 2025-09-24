import { Validators } from "../../../config/validators";
import { USER_ROLES, UserRole } from "../../constants/user-roles.constants";

export class UpdateUserDto {
    private constructor(
        public name?: string,
        public email?: string,
        public password?: string,
        public roles?: UserRole[],
        public phone?: string,
        public img?: string,
        public isActive?: boolean,

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

    static create(object: { [key: string]: any }): [string?, UpdateUserDto?] {
        const {
            name,
            email,
            password,
            roles,
            phone,
            img,
            isActive,
            specialties,
            crm,
            birthDate,
            cpf,
            address
        } = object;

        // Pelo menos um campo deve ser fornecido
        const hasAtLeastOneField = [
            name, email, password, roles, phone, img, isActive,
            specialties, crm, birthDate, cpf, address
        ].some(field => field !== undefined);

        if (!hasAtLeastOneField) {
            return ["At least one field must be provided", undefined];
        }

        // Validações opcionais
        if (name && name.length < 2) return ["Name too short", undefined];
        if (email && !Validators.email.test(email)) return ["Invalid email", undefined];
        if (password && password.length < 6) return ["Password too short", undefined];

        // Validar roles se fornecidas
        if (roles) {
            if (!Array.isArray(roles) || roles.length === 0) {
                return ["At least one role is required", undefined];
            }

            const validRoles = Object.values(USER_ROLES);
            const invalidRoles = roles.filter((role: string) => !validRoles.includes(role as UserRole));
            if (invalidRoles.length > 0) {
                return [`Invalid roles: ${invalidRoles.join(', ')}`, undefined];
            }
        }

        // ✅ CORREÇÃO: Verificar consistência entre roles e specialties/crm
        const isDoctor = roles ? roles.includes(USER_ROLES.DOCTOR) : undefined;

        // Se estamos definindo roles e NÃO é DOCTOR, não pode ter specialties/crm
        if (isDoctor === false) {
            if (specialties && specialties.length > 0) {
                return ["Only DOCTOR users can have specialties", undefined];
            }
            if (crm) {
                return ["Only DOCTOR users can have CRM", undefined];
            }
        }

        // Se estamos tentando adicionar specialties/crm, mas não definimos que é DOCTOR
        if ((specialties && specialties.length > 0) || crm) {
            if (isDoctor === false) {
                return ["Cannot add specialties/CRM to non-DOCTOR user", undefined];
            }
            // Se roles não foi fornecido, vamos assumir que deve ser validado no use case
            // baseado no usuário existente
        }

        // Validações específicas para DOCTOR
        if (isDoctor === true) {
            // Se está definindo como DOCTOR, deve ter specialties
            if (!specialties || !Array.isArray(specialties) || specialties.length === 0) {
                return ["DOCTOR must have at least one specialty", undefined];
            }
        }

        // Validar specialties se fornecidas
        if (specialties) {
            if (!Array.isArray(specialties)) {
                return ["Specialties must be an array", undefined];
            }

            const invalidSpecialties = specialties.filter(id =>
                typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)
            );
            if (invalidSpecialties.length > 0) {
                return ["Invalid specialty IDs format", undefined];
            }
        }

        // Validar phone se fornecido
        if (phone && (phone.length < 10 || phone.length > 15)) {
            return ["Invalid phone number", undefined];
        }

        // Validar CPF se fornecido
        if (cpf && (cpf.length !== 11 || !/^\d{11}$/.test(cpf))) {
            return ["Invalid CPF format", undefined];
        }

        // Validar birthDate se fornecida
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

        return [undefined, new UpdateUserDto(
            name?.trim(),
            email?.toLowerCase().trim(),
            password,
            roles,
            phone?.trim(),
            img?.trim(),
            isActive,
            specialties,
            crm?.trim(),
            parsedBirthDate,
            cpf?.trim(),
            address
        )];
    }
}