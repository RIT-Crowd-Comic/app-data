import {define as userDefine} from './user.model'
import {define as panelSetDefine} from './panelSet.model'


// add to the list
export const modelDefiners = [
    userDefine,
    panelSetDefine
];


export { User, type IUser } from './user.model'
export { PanelSet, type IPanelSet } from './panelSet.model'