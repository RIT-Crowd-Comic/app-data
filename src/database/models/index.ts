import {define as userDefine} from './user.model'
import {define as hookDefine} from './hook.model'

// add to the list
export const modelDefiners = [
    userDefine,
    hookDefine
];


export { User, type IUser } from './user.model';
export { Hook, type IHook } from './hook.model';