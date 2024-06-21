import {define as userDefine} from './user.model'
import {define as hookDefine} from './hook.model'
import {define as panelDefine} from './panel.model'

// add to the list
export const modelDefiners = [
    userDefine,
    hookDefine,
    panelDefine
];


export { User, type IUser } from './user.model';
export { Hook, type IHook } from './hook.model';
export { Panel, type IPanel } from './panel.model';
