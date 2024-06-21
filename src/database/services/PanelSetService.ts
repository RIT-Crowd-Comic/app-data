import { PanelSet } from "../models/panelSet.model";

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
}

export default PanelSetService;