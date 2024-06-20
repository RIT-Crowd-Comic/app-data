import { Model, Sequelize } from "sequelize";

import { setupAssociations, syncTables } from "./initializeModels";
import { modelDefiners } from './models'
import PanelService  from './services/PanelService'
import dotenv from 'dotenv'; 
dotenv.config();

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

// actually define each model
modelDefiners.forEach(modelDefiner => modelDefiner(sequelize));

// additional setup
setupAssociations(sequelize);

// last step is to make sure tables actually exist
syncTables(sequelize).then(
    async () => console.log(await PanelService.createPanel(
        {
            image: '../../../blah.png', 
            index: 0, 
            panel_set_id: 12341234, 
        }))
    );

export default sequelize;
