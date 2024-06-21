import { Hook } from '../models'

interface HookConfig {
    position: number[],
    current_panel_id: number,
    next_panel_set_id: number
}

/**
 * Perform queries on the 'hooks' table
 */
class HookService {
    /**
     * Create a new hook
     * @param {HookConfig} newHook
     * @returns {object} with position, current_panel_id, and next_panel_id properties
     */
    static async createHook(newHook: HookConfig){
        const {position, current_panel_id, next_panel_set_id} = await Hook.create({
            position: newHook.position,
            current_panel_id: newHook.current_panel_id,
            next_panel_set_id: newHook.next_panel_set_id
        });
        return {position, current_panel_id, next_panel_set_id};
    }

    /**
     * Gets a single hook based on id
     * @param {number} id Hook id
     * @returns {object} with position, current_panel_id, and next_panel_id properties from the hook
     */
    static async getHook(id: number){
        // check that requested hook exists
        const hook = await Hook.findOne({where: { id }, attributes: ['position', 'current_panel_id', 'next_panel_set_id']});
        if(!hook) return undefined

        //Return the hook's info
        return {
            position: hook.position,
            current_panel_id: hook.current_panel_id,
            next_panel_set_id: hook.next_panel_set_id
        }
    }

    /**
     * Get all hooks that are associated with a specific panel
     * @param {number} panel_id ID of target panel
     * @returns {object[]} where array is composed of objects with position, current_panel_id, and next_panel_id properties
     */
    static async getPanelHooks(panel_id: number){
        // Find all hooks on requested panel 
        const hooks = await Hook.findAll({where: {current_panel_id: panel_id}});
        if(!(hooks?.length>0)) return undefined
        
        //Parse hooks into usable objects
        const parsedHooks = hooks.map((x)=>{return{position: x.position, current_panel_id: x.current_panel_id, next_panel_set_id: x.next_panel_set_id}});
        //Return the array of hooks
        return parsedHooks;
    }
}

export default HookService;