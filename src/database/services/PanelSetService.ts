import { Sequelize } from "sequelize";
import { PanelSet } from "../models/panelSet.model";
import { User } from "../models/user.model";

interface PanelSetConfig {
    author_id: string
}

class PanelSetService {
    /**
     * Create a new panel set
     * @param {} panelSet 
     */
    static async createPanelSet(panelSet: PanelSetConfig) {
        const { author_id } = await PanelSet.create({
            author_id: panelSet.author_id
        });
        return {author_id}
    }
    /**
     * Gets a panel set based on the id
     * @param {} id the id of the panel set
     * @returns null if the panel set is not found/exists
     */
    static async getPanelSetByID(id: number) {
        return await PanelSet.findByPk(id);
    }
    /**
     * Get all of the panels a specific author created
     * @param {} id the author's UUID
     * @returns an array of all the panels found
     */
    static async getAllPanelSetFromUser(id: string) {
        const panelSets = await PanelSet.findAll({
            where: {author_id: id}
     });
        return panelSets;
    }
}

export default PanelSetService;