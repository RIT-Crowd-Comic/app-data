import { Panel } from '../models'

interface PanelConfig {
    image: string,
    index: number,
    panel_set_id: number,
}

interface PanelInfoCreate {
    id: number,
    image: string,
    index: number,
    panel_set_id: number
}

interface PanelInfoGet {
    image: string,
    index: number,
    panel_set_id: number
}

/**
 * Perform queries on the 'Panels' table
 */
class PanelService {

    /**
     * Create a new Panel
     * @param {} newPanel
     * @returns {} PanelInfoCreate
     */
    static async createPanel(newPanel: PanelConfig){
        const {id, image, index, panel_set_id } = await Panel?.create({
            image: newPanel.image,
            index: newPanel.index,
            panel_set_id: newPanel.panel_set_id,
        });
        return {id, image, index, panel_set_id } as PanelInfoCreate;
    }

    /**
     * Authenticate a panel before retrieve the panel's data
     * @param id 
     * @returns PanelInfoGet
     */
    static async getPanel(id: number) {
        
        // make sure the panel actually exists
        const panel = await Panel?.findOne({where: { id }, attributes: ['image', 'index', 'panel_set_id']});
        if (!panel) return undefined;

        return {
            image: panel.image,
            index: panel.index,
            panel_set_id: panel.panel_set_id
        } as PanelInfoGet
    }
}

export default PanelService;