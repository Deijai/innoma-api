import { RegisterUserDto, UserSigninDto } from "..";
import { UserEntity } from "../entities/user.entity";
export abstract class AuthDatasource {
  abstract signin(userSigninDto: UserSigninDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
