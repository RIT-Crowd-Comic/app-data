import { Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 */
const setupAssociations = (sequelize : Sequelize) => {

    //grab the models
    const { user, panel_set } = sequelize.models;
    user.hasOne(panel_set, {foreignKey: 'author_id', sourceKey: "id"});
    panel_set.belongsTo(user);
    //would it be author_id

};


/**
 * Call this function once in src/index.js to set up a new database
 * @param {Sequelize} sequelize
 */
const syncTables = async (sequelize : Sequelize, force: boolean = false) => sequelize.sync({ force });

export {setupAssociations, syncTables};