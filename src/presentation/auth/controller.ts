import { Request, Response } from "express";
import { RegisterUserDto, AuthRepository, CustomError, RegisterUser, UserSigninDto, SigninUser } from "../../domain";
import { UserModel } from "../../data/mongodb";
export class AuthController {
  // DI
  constructor(private readonly authRepository: AuthRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    console.log('registerUserDto: ', registerUserDto, 'error: ', error);
    

    if (error) return res.status(400).json({ error });
    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  signinUser = (req: Request, res: Response) => {
    const [error, userSigninDto] = UserSigninDto.create(req.body);

    if (error) return res.status(400).json({ error });
    new SigninUser(this.authRepository)
      .execute(userSigninDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  getUsers = (req: Request, res: Response) => {
    return UserModel.find()
      .then((users) => res.json({ users, user: req.body.user }))
      .catch((error) => this.handleError(error, res));
  };
}
