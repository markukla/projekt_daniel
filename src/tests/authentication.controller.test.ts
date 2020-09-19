import * as request from 'supertest';
import * as typeorm from 'typeorm';


import AuthenticationController from '../authentication/authentication.controller';
import CreatePrivilegedUserDto from "../Models/Users/PrivilegedUsers/user.dto";
import App from "../app";

(typeorm as any).getRepository = jest.fn();

describe('The AuthenticationController', () => {
  describe('POST /auth/register', () => {
    describe('if the email is not taken', () => {
      it('response should have the Set-Cookie header with the Authorization token', () => {
        const userData: CreatePrivilegedUserDto = {
          fulName: 'John Smith',
          email: 'john@smith.com',
          password: 'strongPassword123',
         active:true,
          isAdmin:true

        };
        process.env.JWT_SECRET = 'jwt_secret';
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(undefined),
          create: () => ({
            ...userData,
            id: 0,
          }),
          save: () => Promise.resolve(),
        });
        const authenticationController = new AuthenticationController();
        const app = new App([
          authenticationController,
        ]);

        // get server returns app which is property of App class initialized with express aplication
        return request(app.getServer())
          .post(`${authenticationController.path}/register`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});
