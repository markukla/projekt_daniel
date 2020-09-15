import {Connection, ConnectionOptions, createConnection} from "typeorm";
import * as typeorm from "typeorm";
import {config_test} from "../../ormconfig";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

async function connectToDatabase(config:PostgresConnectionOptions){
    try {
      await createConnection(config);
        console.log(`connected to database= ${config.database} on port: ${config.port}`);



    } catch (error) {
        console.log('Error while connecting to the database', error);

    }


}
async function closeConnectionToDatabase(config:PostgresConnectionOptions) {
    await typeorm.getConnection().close();
    console.log(`connection to database= ${config.database} has been closed`);
}

async function clearDatabase(config:PostgresConnectionOptions) {
    await typeorm.getConnection().dropDatabase();
    console.log(` database= ${config.database} has been droped`);

}
export {connectToDatabase,closeConnectionToDatabase,clearDatabase};