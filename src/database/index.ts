import { Model, Sequelize } from "sequelize";

import { setupAssociations, syncTables } from "./initializeModels";
import { modelDefiner } from "./models/types";

/**
 * SSL is required for Heroku Postgres
 */
const sslOptions = process.env.SSL === 'true' ?
    { dialectOptions: { ssl: { rejectUnauthorized: false }, }, } :
    {};

const sequelize = new Sequelize(
    process.env.DATABASE_URL ?? '',
    {
        logging:  false,
        protocol: 'postgres',
        dialect:  'postgres',
        ...sslOptions,
        pool:     {
            max:     5,
            min:     0,
            acquire: 30000,
            idle:    10000
        }
    }
);


// since most models depend on user, user.model might have to be defined first
const models : modelDefiner[] = [

];

// actually define each model
models.forEach(modelDefiner => modelDefiner(sequelize));
 

// additional setup
setupAssociations(sequelize);

// last step is to make sure tables actually exist
syncTables(sequelize);

export default sequelize ;
