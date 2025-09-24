import { UserMapper } from "..";
import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import {
  AuthDatasource,
  CustomError,
  RegisterUserDto,
  UserEntity,
  UserSigninDto,
} from "../../domain";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {}

  async signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    const { email, password } = userSigninDto;

    try {
      const emailExists = await UserModel.findOne({ email: email });

      if (!emailExists)
        throw CustomError.badRequest("Email or Password invalids");

      const comparePassword = this.comparePassword(
        password,
        emailExists.password!
      );

      console.log("comparePassword: ", comparePassword);
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
    const { name, email, password } = registerUserDto;

    try {
      const exists = await UserModel.findOne({ email: email });

      if (exists) throw CustomError.badRequest("User already exists");

      const user = await UserModel.create({
        name: name,
        email: email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserMapper.userEntityFromObject(user);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}
