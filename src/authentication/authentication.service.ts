import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {getManager, getRepository} from 'typeorm';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import User from "../Models/Users/user.entity";
import LogInDto from "./logIn.dto";
import ChangePasswordDto from "./changePassword.dto";
import IncorrectPaswordException from "../Exceptions/IncorrectPaswordException";
import UserWithThisEmailDoesNotExistException from "../Exceptions/UserWithThisEmailDoesNotExistException";
import LoggedUser from "./loggedUser";

import NotActiveException from "../Exceptions/NotActiveException";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import validatePassword from "../utils/validatePassword/validate.password";
import WeekPasswordException from "../Exceptions/ToWeekPasswordException";
import RepositoryService from "../interfaces/service.interface";


class AuthenticationService implements RepositoryService{
    public manager = getManager();
    public repository=getRepository(User);

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
            else {
                throw new WrongCredentialsException();
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
            let hashedPassword:string=null;
            const validationResult= validatePassword(passwordData.newPassword);


            if(validationResult.validatedPassword){
                hashedPassword = await bcrypt.hash(validationResult.validatedPassword, 10);
            }
            else{
                throw new WeekPasswordException(validationResult.foultList);
            }


            user.password = hashedPassword;
            const updatedUser=await this.manager.save(User, user);
            return updatedUser;


        } else {
            throw new IncorrectPaswordException();
        }


    }
}

export default AuthenticationService;
