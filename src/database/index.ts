

import dotenv from 'dotenv'
dotenv.config()

import { Sequelize } from "sequelize";
import { setupAssociations, syncTables } from "./initializeModels";
import { modelDefiners } from './models'
import PanelSetService from './services/PanelSetService';
import UserService from './services/UserService';

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
        },
    }
);

// actually define each model
modelDefiners.forEach(modelDefiner => modelDefiner(sequelize));

// additional setup
setupAssociations(sequelize);

// last step is to make sure tables actually exist
syncTables(sequelize).then(
    async () => {
        UserService.createUser({username: "username",password: "password", email: "email@yahoo.com", display_name: "display_name"})
         PanelSetService.createPanelSet({ author_id: "e90da25c-cd92-4a96-88f8-2f38f9db7417" });
    } );

export default sequelize;
