import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto, UserSigninDto } from "..";

export abstract class AuthRepository {
  abstract signin(userSigninDto: UserSigninDto): Promise<UserEntity>;
  abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
}
