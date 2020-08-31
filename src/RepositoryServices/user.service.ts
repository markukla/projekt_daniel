import * as express from 'express';
import {getRepository, Repository} from "typeorm";
import Post from "../Models/Post/post.entity";
import CreatePostDto from "../Models/Post/post.dto";
import PostNotFoundException from "../Exceptions/PostNotFoundException";
import RepositoryService from "../interfaces/service.interface";
import User from "../Models/User/user.entity";
import CreateUserDto from "../Models/User/user.dto";
import UserWithThatEmailAlreadyExistsException from "../Exceptions/UserWithThatEmailAlreadyExistsException";
import TokenData from "../interfaces/tokenData.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import LogInDto from "../authentication/logIn.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
class UserService implements RepositoryService<User> {
    public repository: Repository<User> = getRepository(User);


    public createNewRecord = async (request: express.Request, response: express.Response) => {
        const userData: CreateUserDto = request.body;
        const newUser = this.repository.create(userData);
        await this.repository.save(newUser);
        response.send(newUser);
    }

    public getAllRecords = async (request: express.Request, response: express.Response) => {
        // in relation option: it takes table name as paramter, not enity name
        const records = await this.repository.find({relations: ['roles']});
        response.send(records);
    }

    public findOneRecord = async (request: express.Request, response: express.Response, next: express.NextFunction):Promise<User> => {
        const id = request.params.id;
        return
        const user = await this.repository.findOne(id, {relations: ['roles']});
        if (user) {
            response.send(user);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public modifyRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const userData: User = request.body;
        try {
// i use save for updating, becasue update method does not work with object related to other object with many to many relation, in this case users-and roles
            userData.userid = Number(id);
            await this.repository.save(userData);

            const updatedUser = await this.repository.findOne(id, {relations: ['roles']});
            if (updatedUser) {
                response.send(updatedUser);
            } else {
                next(new PostNotFoundException(id));
            }
        } catch (e) {
            var erroType = e.type;
            var erroMessage = e.message;
            console.log(e.trace);
            response.send({

                "errorType": `${erroType}`,
                "errorMessage": `${erroMessage}`
            })

        }
    }

    public deleteRecord = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const deleteResponse = await this.repository.delete(id);
        console.log(deleteResponse);
        if (deleteResponse.affected === 1) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    }

    public async register(userData: CreateUserDto) {
        if (
            await this.repository.findOne(
        {email: userData.email},
                {relations: ['roles']}
            )
        ) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.repository.create({
            ...userData,
            password: hashedPassword,
        });
        await this.repository.save(user);
        user.password = undefined;
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }

    public async login(logInData: LogInDto) {
        const user = await this.repository.findOne({email: logInData.email},{relations: ['roles']});
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
               const loggedUser=user;
               loggedUser.password=undefined;


                const tokenData: TokenData = this.createToken(user);
                return {
                    loggedUser,
                    tokenData

                };
            }
        }
    }


    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            id: String(user.userid)
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        };
    }


}

export default UserService;


