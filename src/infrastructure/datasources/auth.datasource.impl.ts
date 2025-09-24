import { UserMapper } from "..";
import { BcryptAdapter } from "../../config";
import { UserModel, SpecialtyModel } from "../../data/mongodb";
import {
  AuthDatasource,
  CustomError,
  RegisterUserDto,
  UserEntity,
  UserSigninDto,
  USER_ROLES
} from "../../domain";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) { }

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    const { email, password } = userSigninDto;

    try {
      const emailExists = await UserModel.findOne({ email: email })
        .populate('specialties', 'name description');

      if (!emailExists)
        throw CustomError.badRequest("Email or Password invalids");

      const comparePassword = this.comparePassword(
        password,
        emailExists.password!
      );

      if (!comparePassword)
        throw CustomError.badRequest("Email or Password invalids");

      return UserMapper.userEntityFromObject(emailExists!);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const {
      name,
      email,
      password,
      roles,
      specialties,
      ...otherFields
    } = registerUserDto;

    try {
      // Verificar se email já existe
      const exists = await UserModel.findOne({ email: email });
      if (exists) throw CustomError.badRequest("User already exists");

      const isDoctor = roles.includes(USER_ROLES.DOCTOR);

      // ✅ CORREÇÃO: Verificar especialidades apenas se for DOCTOR
      if (isDoctor && specialties && specialties.length > 0) {
        const existingSpecialties = await SpecialtyModel.find({
          _id: { $in: specialties },
          isActive: true
        });

        if (existingSpecialties.length !== specialties.length) {
          throw CustomError.badRequest("One or more specialties not found or inactive");
        }
      } else if (isDoctor && (!specialties || specialties.length === 0)) {
        throw CustomError.badRequest("DOCTOR must have at least one specialty");
      }

      // Preparar dados do usuário
      const userData: any = {
        name: name,
        email: email,
        password: this.hashPassword(password),
        roles: roles,
        ...otherFields
      };

      // ✅ CORREÇÃO: Só adicionar specialties se for DOCTOR
      if (isDoctor) {
        userData.specialties = specialties || [];
      }

      // Criar usuário
      const user = await UserModel.create(userData);
      await user.save();

      // Popular as especialidades se for DOCTOR
      if (isDoctor) {
        await user.populate('specialties', 'name description');
      }

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}