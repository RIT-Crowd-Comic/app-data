import { Hook } from '../models'

interface HookConfig {
    position: Float32Array,
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
        return Hook?.create({
            position: newHook.position,
            current_panel_id: newHook.current_panel_id,
            next_panel_set_id: newHook.next_panel_set_id
        },
        {
            include: ['position', 'current_panel_id', 'next_panel_set_id']
        });
    }

    static async getHook(id: number){
        // check that requested hook exists
        const hook = await Hook?.findOne({where: {id}, attributes: ['position', 'current_panel_id', 'next_panel_set_id']});
        if(!hook) return undefined

        //Return the hook's info
        return {
            position: hook.position,
            current_panel_id: hook.current_panel_id,
            next_panel_set_id: hook.next_panel_set_id
        }
    }
}

export default HookService;