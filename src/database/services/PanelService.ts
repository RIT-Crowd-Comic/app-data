import { Panel } from '../models'

interface PanelConfig {
    image: string,
    index: number,
    panel_set_id: number,
}


/**
 * Perform queries on the 'Panels' table
 */
class PanelService {

    /**
     * Create a new Panel}
     * @param {} newPanel
     */
    static createPanel(newPanel: PanelConfig){
        return Panel?.create({
            image: newPanel.image,
            index: newPanel.index,
            panel_set_id: newPanel.panel_set_id,
        }, 
        {
            include: ['image', 'index', 'panel_set_id']
        });
    }

    /**
     * Authenticate a panel before retrieve the panel's data
     * @param id 
     * @returns 
     */
    static async authenticate(id: number, username: string,) {
        
        // make sure the panel actually exists
        const panel = await Panel?.findOne({where: { id }, attributes: ['image', 'index', 'panel_set_id']});
        if (!panel) return undefined;

        return {
            image: panel.image,
            index: panel.index,
            panel_set_id: panel.panel_set_id
        }
    }
}

export default PanelService;