import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {getManager, getRepository} from 'typeorm';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';

import User from "../Models/User/user.entity";
import BusinesPartner from "../Models/BusinessPartner/businesPartner.entity";
import RequestWithUser from "../interfaces/requestWithUser.interface";



async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  console.log(cookies.Authorization);
  const manager=getManager();
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      console.log(verificationResponse);

      const user :User= await manager.findOne(User,{email:verificationResponse.email},{relations: ['roles']})
      console.log(user);
      const businesPartner:BusinesPartner=await manager.findOne(BusinesPartner,{email:verificationResponse.email},{relations: ['roles']})




      if (user) {
        var userActive:boolean=user.active;
        if(userActive){
        request.user = user;
        console.log(request.user);
        next();
        }
      }else if(businesPartner){
        var partnerActive:boolean=businesPartner.active;
        if(partnerActive){


        request.user=businesPartner;
        next();
        }
      }
      else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
