import { AuthRepository, CustomError, SignToken, UserToken } from "../..";
import { JwtAdapter } from "../../../config";
import { RegisterUserDto } from "../../dtos/auth/register-user.dto";

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}
  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
    // criar usuário
    const user = await this.authRepository.register(registerUserDto);

    // token
    const token = await this.signToken({ id: user.id }, "2h");

    if(!token) throw CustomError.internalServer('Internal server error: Error generating token');

    return {
      token: token!,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
