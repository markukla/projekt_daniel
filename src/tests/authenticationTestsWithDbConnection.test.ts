import {connectToDatabase} from "../utils/DatabaseUtil/manageDatabaseConnection";
import {config_test} from "../../ormconfig";
import {
    insertRolesToDatabase,
    insertTestMaterialsToDatabase,
    insertTestUsersToDatabase
} from "../utils/DatabaseUtil/insertTestDataToDatabase";
import UsersExampleForTests from "./usersExampleForTests";
import TokenData from "../interfaces/tokenData.interface";
import * as typeorm from "typeorm";
import AuthenticationService from "../authentication/authentication.service";
import User from "../Models/Users/user.entity";
import Role from "../Models/Role/role.entity";
import RoleEnum from "../Models/Role/role.enum";
import LogInDto from "../authentication/logIn.dto";
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import WrongCredentialsException from "../Exceptions/WrongCredentialsException";
import ChangePasswordDto from "../authentication/changePassword.dto";
import * as bcrypt from "bcrypt";
import IncorrectPaswordException from "../Exceptions/IncorrectPaswordException";

beforeAll(async () => {
        await connectToDatabase(config_test);
        await insertRolesToDatabase();
        await insertTestUsersToDatabase();


    }
);
describe('The AuthenticationService',  () => {
    process.env.JWT_SECRET = 'blablabla';
    const exampleUser=new UsersExampleForTests();

    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData: TokenData = {
                token: '',
                expiresIn: 1,
            };

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
        const logInDataWithWrongEmail: LogInDto = {
            email: "blasdskjd@gmail.com",
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

               ;
                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithWrongEmail))
                    .rejects.toMatchObject(new WrongCredentialsException());
            });
        });
        describe('if user exist but password does not match', () => {
            it('should  throw an error', async () => {



                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithWrongPassword))
                    .rejects.toMatchObject(new WrongCredentialsException());
            });
        });
        describe('if user exist and password match', () => {
            it("should not throw an error", async () => {


                const authenticationService = new AuthenticationService();
                await expect(authenticationService.login(logInDataWithCorrectUserAndPassword)).resolves.toBeDefined();


            });

        });
    });
    describe('when logged user is changing Password',()=>{
        const userToupdatePasswor=exampleUser.activeAdminUserExample;
        const correctoldpassword=exampleUser.correctUnhashedPasswordOfexampleUserInDatabase;

        const wrongOldpassword=exampleUser.wrongUnhashedPasswordOfexampleUserInDatabase;
        const newPassword="NicramUpdated123";
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

                const authenticationService=new AuthenticationService();
                let updatedPassword:string="";
                    await  authenticationService.changePasswordByLoggedUser(userToupdatePasswor,passwordDataWithcorrectOldPassword).then(updatedUser=>{
                        updatedPassword=updatedUser.password;
                    });

                await expect(bcrypt.compare(newPassword,updatedPassword)).resolves.toBe(true);


            });
        });
        describe('if old password  does not much',()=>{
            it('should throw an error',async ()=>{
                const hashedNewPassword=await bcrypt.hash(newPassword,10);


                const authenticationService=new AuthenticationService();
                await expect(authenticationService.changePasswordByLoggedUser(userToupdatePasswor,passwordDataWithWrongOldPassword ))
                    .rejects.toMatchObject(new IncorrectPaswordException());



            });
        })

    });
})