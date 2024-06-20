

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
        //Create hooks
        await HookService.createHook(
        {
            position: [1,2], 
            current_panel_id: 2, 
            next_panel_set_id: 4, 
        });
        await HookService.createHook(
        {
            position: [1,4], 
            current_panel_id: 2, 
            next_panel_set_id: 5, 
        });
        await HookService.createHook(
        {
            position: [2,7], 
            current_panel_id: 3, 
            next_panel_set_id: 6, 
        });

        //Find the panel_id = 2 hooks and display them
        const panHooks = await HookService.getPanelHooks(2);
        console.log('Hooks on Panel 2:', JSON.stringify(panHooks, null, 2));

        //Get id of hook on panel 3 and print it with return from getHook
        const hook = await Hook?.findOne({where: {current_panel_id: 3}});
        const id = hook?.id;
        if(id) console.log(`Hook with id: ${id}:`, JSON.stringify(HookService.getHook(id)));

        //Delete the hooks
        await Hook?.destroy({
            where: {[Op.or]: [{current_panel_id: 2}, {current_panel_id: 3}]},
          });
    });

export default sequelize;
