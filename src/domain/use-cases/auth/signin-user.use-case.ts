import { AuthRepository, CustomError, SignToken, UserToken } from "../..";
import { JwtAdapter } from "../../../config";
import { UserSigninDto } from "../../dtos/auth/signin-user.dto";
interface SigninUserUseCase {}

interface SigninUserUseCase {
  execute(userSigninDto: UserSigninDto): Promise<UserToken>;
}

export class SigninUser implements SigninUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = JwtAdapter.generateToken
  ) {}

  async execute(userSigninDto: UserSigninDto): Promise<UserToken> {
    const user = await this.authRepository.signin(userSigninDto);

    if (!user) throw CustomError.badRequest("User not found");

    // token
    const token = await this.signToken({ id: user.id }, "2h");

    // if (!token)
    //   throw CustomError.internalServer(
    //     "Internal server error: Error generating token"
    //   );

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
