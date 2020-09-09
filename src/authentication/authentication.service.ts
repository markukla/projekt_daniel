import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {getManager, getRepository} from 'typeorm';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import User from "../Models/User/user.entity";
import LogInDto from "./logIn.dto";
import ChangePasswordDto from "./changePassword.dto";
import IncorrectPaswordException from "../Exceptions/IncorrectPaswordException";
import UserWithThisEmailDoesNotExistException from "../Exceptions/UserWithThisEmailDoesNotExistException";
import LoggedUser from "./loggedUser";

import NotActiveException from "../Exceptions/NotActiveException";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import validatePassword from "./validate.password";
import WeekPasswordException from "../Exceptions/ToWeekPasswordException";


class AuthenticationService {
    private manager = getManager();

    public async login(logInData: LogInDto): Promise<LoggedUser> {
        var loggedUser: LoggedUser;
        const user: User = await this.manager.findOne(User, {email: logInData.email}, {relations: ['roles']});

        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {


                user.password = undefined;
                const tokenData: TokenData = this.createToken(user);
                loggedUser = new LoggedUser(user, tokenData);
                return loggedUser;


            }
        } else {
            throw new WrongCredentialsException();
        }
    }


    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: User ): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;

        const dataStoredInToken: DataStoredInToken = {

            id: user.id
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }

    public changePasswordByLoggedUser = async (user: User, passwordData: ChangePasswordDto): Promise<User> => {


        const oldPasswordMatch = await bcrypt.compare(passwordData.oldPassword, user.password);

        if (oldPasswordMatch) {
            const validatedPassword: string = validatePassword(passwordData.newPassword);
            if (validatedPassword) {
                var hashedPassword: string = await bcrypt.hash(validatedPassword, 10);
                user.password = hashedPassword;
                await this.manager.save(User, user)
                const updatedUser = await this.manager.findOne(User, user.id);
                return updatedUser;
            }


        } else {
            throw new IncorrectPaswordException();
        }


    }
}

export default AuthenticationService;
