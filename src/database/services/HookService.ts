import { INTEGER } from '@sequelize/core/_non-semver-use-at-your-own-risk_/dialects/abstract/data-types.js'
import { Hook } from '../models'

interface HookConfig {
    position: Float32Array,
    current_panel_id: INTEGER,
    next_panel_set_id: INTEGER
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

    static async authenticate(id: INTEGER){
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