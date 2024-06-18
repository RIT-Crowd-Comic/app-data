import { Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 */
const setupAssociations = (sequelize : Sequelize) => {

    //grab the models
    const { } = sequelize.models;

    //set up the relationships
};


/**
 * Call this function once in src/index.js to set up a new database
 * @param {Sequelize} sequelize
 */
const syncTables = async (sequelize : Sequelize) => sequelize.sync();

export {setupAssociations, syncTables};