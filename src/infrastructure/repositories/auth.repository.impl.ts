import {
  AuthDatasource,
  AuthRepository,
  RegisterUserDto,
  UserEntity,
  UserSigninDto,
} from "../../domain";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}
  signin(userSigninDto: UserSigninDto): Promise<UserEntity> {
    return this.datasource.signin(userSigninDto);
  }

  register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    return this.datasource.register(registerUserDto);
  }
}
