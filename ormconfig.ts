// @ts-ignore
import { ConnectionOptions } from 'typeorm';
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {

    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
};
const config_test: PostgresConnectionOptions = {

    type: 'postgres',
    host:process.env.POSTGRES_HOST,
    port:Number(process.env.POSTGRES_TEST_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database:process.env.POSTGRES_TEST_DB,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    dropSchema:true,
    logging:false

};
 export {config,config_test};