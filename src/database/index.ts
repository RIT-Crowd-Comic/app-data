

import dotenv from 'dotenv'
dotenv.config()

import { Sequelize, Op } from "sequelize";
import { setupAssociations, syncTables } from "./initializeModels";
import { Hook, modelDefiners } from './models'
import HookService from './services/HookService';

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
    //Hook query tests
    async () => {
        //Create two hooks
        console.log(await HookService.createHook(
        {
            position: [1,2], 
            current_panel_id: 2, 
            next_panel_set_id: 4, 
        }));
        console.log(await HookService.createHook(
        {
            position: [1,4], 
            current_panel_id: 2, 
            next_panel_set_id: 5, 
        }));

        //Find the hooks and display them
        const hooks = await Hook.findAll();
        console.log('All users:', JSON.stringify(hooks, null, 2));

        //Delete the hooks
        await Hook.destroy({
            where: {current_panel_id: 2},
          });
    });

export default sequelize;
