export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public roles: string[],
    public img?: string,
    public phone?: string,
    public isActive: boolean = true,
    public createdAt?: Date,
    public updatedAt?: Date,
    public createdBy?: string,

    // Campos específicos para DOCTOR
    public specialties?: string[], // Array de IDs das especialidades
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
}