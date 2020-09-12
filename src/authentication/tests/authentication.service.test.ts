import * as typeorm from 'typeorm';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData from '../../interfaces/tokenData.interface';

import AuthenticationService from '../authentication.service';
import CreatePrivilegedUserDto from "../../Models/Users/PrivilegedUsers/user.dto";
import LogInDto from "../logIn.dto";
import User from "../../Models/Users/user.entity";
import Role from "../../Models/Role/role.entity";
import RoleEnum from "../../Models/Role/role.enum";
import WrongCredentialsException from "../../Exceptions/WrongCredentialsException";
import {getManager} from "typeorm";
import * as bcrypt from 'bcrypt';
import UsersExampleForTests from "../../Models/Users/usersExampleForTests";
import ChangePasswordDto from "../changePassword.dto";
import IncorrectPaswordException from "../../Exceptions/IncorrectPaswordException";

(typeorm as any).getManager = jest.fn();

describe('The AuthenticationService',  () => {
    process.env.JWT_SECRET = 'blablabla';
    const exampleUser=new UsersExampleForTests();

    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData: TokenData = {
                token: '',
                expiresIn: 1,
            };
            (typeorm as any).getManager.mockReturnValue({});
            const authenticationService = new AuthenticationService();
            expect(typeof authenticationService.createCookie(tokenData))
                .toEqual('string');
        });
    });
    describe('when user is trying to log in',  () => {
        var hashedPassword="$2b$10$fpooDkA4UaG/9nDsuuUmB.bIUJ7ittTknMl8nEMQ9o28UQPXqdZBC";
        const unhashedPasswordOfexampleAdminUserInDatabase:string='Nicram12';

        const exampleAdminUserInDatabase: User = {
            fulName: 'John Smith',
            email: 'john@smith.com',
            password: hashedPassword,
            active: true,
            id: 1,
            roles: [new Role(RoleEnum.ADMIN), new Role(RoleEnum.EDITOR)],
            businesPartnerCompanyName: null,
            code: null


        };


        const logInDataWithWrongPassword: LogInDto = {
            email: "john@smith.com",
            password: "PasswordWhichDoesnNotMatch123"
        };
        const logInDataWithCorrectUserAndPassword: LogInDto = {
            email: 'john@smith.com',
            password: unhashedPasswordOfexampleAdminUserInDatabase
        };
        describe('if user email is not found in database', () => {

            it('should throw an error', async () => {
                const userData: CreatePrivilegedUserDto = {
                    fulName: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                    active: true,
                    isAdmin: true

                };

                (typeorm as any).getManager.mockReturnValue({
                    findOne: () => Promise.resolve(undefined)
                });
                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithWrongPassword))
                    .rejects.toMatchObject(new WrongCredentialsException());
            });
        });
        describe('if user exist but password does not match', () => {
            it('should  throw an error', async () => {


                (typeorm as any).getManager.mockReturnValue({
                    findOne: () => Promise.resolve(exampleAdminUserInDatabase),


                });
                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithWrongPassword))
                    .rejects.toMatchObject(new WrongCredentialsException());
            });
        });
        describe('if user exist and password match', () => {
            it("should not throw an error", async () => {

                (typeorm as any).getManager.mockReturnValue({
                    findOne: () => Promise.resolve(exampleAdminUserInDatabase),

                });
                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithCorrectUserAndPassword)).resolves.toBeDefined();


            });

        });
    });
    describe('when logged user is changing Password',()=>{
        const userToupdatePasswor=exampleUser.activeAdminUserExample;
        const correctoldpassword=exampleUser.correctUnhashedPasswordOfexampleUserInDatabase;

        const wrongOldpassword=exampleUser.wrongUnhashedPasswordOfexampleUserInDatabase;
        const newPassword="Nicrams123";
        const passwordDataWithcorrectOldPassword:ChangePasswordDto={
            newPassword:newPassword,
            oldPassword:correctoldpassword

        };
        const passwordDataWithWrongOldPassword:ChangePasswordDto={
            newPassword:newPassword,
            oldPassword:wrongOldpassword

        };

        describe('if old password  much',()=>{
            it('should not throw an error',async ()=>{
                const hashedNewPassword=await bcrypt.hash(newPassword,10);

              const updatedUser={
                  ...userToupdatePasswor,
                  password:hashedNewPassword
              };



                (typeorm as any).getManager.mockReturnValue({
                    save: () => Promise.resolve(updatedUser),


                });
                const authenticationService=new AuthenticationService();
                await expect(authenticationService.changePasswordByLoggedUser(userToupdatePasswor,passwordDataWithcorrectOldPassword ))
                    .resolves.toMatchObject(updatedUser);



                });
        });
        describe('if old password  does not much',()=>{
            it('should throw an error',async ()=>{
                const hashedNewPassword=await bcrypt.hash(newPassword,10);

                const updatedUser={
                    ...userToupdatePasswor,
                    password:hashedNewPassword
                };



                (typeorm as any).getManager.mockReturnValue({
                    save: () => Promise.resolve(updatedUser),


                });
                const authenticationService=new AuthenticationService();
                await expect(authenticationService.changePasswordByLoggedUser(userToupdatePasswor,passwordDataWithWrongOldPassword ))
                    .rejects.toMatchObject(new IncorrectPaswordException());



            });
        })

    });
});
