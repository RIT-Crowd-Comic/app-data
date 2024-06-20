import {define as userDefine} from './user.model'
import {define as panelDefine} from './panel.model'

// add to the list
export const modelDefiners = [
    userDefine,
    panelDefine
];

export { User, type IUser } from './user.model'
export { Panel, type IPanel } from './panel.model'