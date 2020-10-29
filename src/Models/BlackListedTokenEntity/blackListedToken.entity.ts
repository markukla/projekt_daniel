import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity('blaclistedTokens')
class BlackListedToken{
    @PrimaryGeneratedColumn()
    id?:number;
    @Column()
    blacklistedToken:string;


    constructor(blacklistedToken: string) {
        this.blacklistedToken = blacklistedToken;
    }
}

export default BlackListedToken
