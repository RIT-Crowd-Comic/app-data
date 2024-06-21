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

        return { author_id };
    }
    /**
     * Gets a panel based on the id
     * @param {} id the id of the panel set
     * @returns null if the panel set is not found/exists
     */
    static async getPanelByID(id: number) {
        return await PanelSet.findByPk(id);
    }

    // //todo: get all of the panels the author created
    // static async getAllPanelFromUser(userId: string) {

    // }
}

export default PanelSetService;