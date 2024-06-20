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
     * @param {} newHook
     */
    static async createHook(newHook: HookConfig){
        const {position, current_panel_id, next_panel_set_id} = await Hook?.create({
            position: newHook.position,
            current_panel_id: newHook.current_panel_id,
            next_panel_set_id: newHook.next_panel_set_id
        });
        return {position, current_panel_id, next_panel_set_id};
    }

    static async getHook(id: number){
        // check that requested hook exists
        const hook = await Hook?.findOne({where: { id }, attributes: ['position', 'current_panel_id', 'next_panel_set_id']});
        if(!hook) return undefined

        //Return the hook's info
        return {
            position: hook.position,
            current_panel_id: hook.current_panel_id,
            next_panel_set_id: hook.next_panel_set_id
        }
    }

    static async getPanelHooks(panel_id: number){
        // Find all hooks on requested panel 
        const hooks = await Hook?.findAll({where: {current_panel_id: panel_id}});
        if(!(hooks?.length>0)) return undefined
        
        //Parse hooks into usable objects
        const parsedHooks = [];
        for(let i=0, size=hooks.length; i<size; i++){
            parsedHooks.push({
                position: hooks[i].position,
                current_panel_id: hooks[i].current_panel_id,
                next_panel_set_id: hooks[i].next_panel_set_id
            });
        }
        //Return the array of hooks
        return parsedHooks;
    }
}

export default HookService;