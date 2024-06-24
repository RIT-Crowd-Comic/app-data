import { Sequelize } from "sequelize";
import { PanelSet } from "../models/panelSet.model";
import { User } from "../models/user.model";

interface PanelSetConfig {
    username: string
}

class PanelSetService {
    /**
     * Create a new panel set
     * @param {} panelSet 
     */
    static async createPanelSet(panelSet: PanelSetConfig) {
        // get id from username
        const user = await User.findOne({ where: {username: panelSet.username } });
        if (user == null) return undefined;

        const { author_id } = await PanelSet.create({
            author_id: user.id
        });

        return { author_id };
    }
    /**
     * Gets a panel set based on the id
     * @param {} id the id of the panel set
     * @returns null if the panel set is not found/exists
     */
    static async getPanelSetByID(id: number) {
        return await PanelSet.findByPk(id);
    }

    // ! This can be rewritten with inner joins, but unsure how without getting user information in the results
    /**
     * Get all of the panels a specific author created
     * @param {} username author's username
     * @returns an array of all the panels found
     */
    static async getAllPanelSetFromUser(username: string) {
         const user = await User.findOne({ where: {username: username } });
         const id = user?.id;
        const panel_sets = await PanelSet.findAll({ where: {author_id: id } });
        return panel_sets;
    }
}

export default PanelSetService;