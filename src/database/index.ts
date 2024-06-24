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
syncTables(sequelize, true).then(
    async () => { 
        
    } );

export default sequelize;