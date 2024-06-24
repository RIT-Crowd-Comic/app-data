import {define as userDefine} from './user.model'
import {define as panelSetDefine} from './panelSet.model'
import {define as hookDefine} from './hook.model'
import {define as panelDefine} from './panel.model'

// add to the list
export const modelDefiners = [
    userDefine,
    panelSetDefine,
    hookDefine,
    panelDefine
];


export { User, type IUser } from './user.model'
export { PanelSet, type IPanelSet } from './panelSet.model'
export { Hook, type IHook } from './hook.model';
export { Panel, type IPanel } from './panel.model';