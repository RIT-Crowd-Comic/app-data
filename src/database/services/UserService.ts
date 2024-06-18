import { User } from '../models'
import { hash, compare } from 'bcrypt'


const saltRounds = 10;

interface UserConfig {
    username: string,
    password: string,
    email: string,
    display_name: string,
}

/**
 * Perform queries on the 'users' table
 */
class UserService {

    /**
     * Create a new user
     * @param {} newUser 
     */
    static async createUser(newUser: UserConfig){
        return User?.create({
            username: newUser.username,
            display_name: newUser.display_name,
            password: await hash(newUser.password, saltRounds),
            email: newUser.email,
        }, 
        {
            include: ['username', 'display_name', 'email']
        });
    }

    /**
     * Authenticate a user before retrieve the user's data
     * @param username 
     * @param password un-hashed password
     * @returns 
     */
    static async authenticate(username: string, password: string) {
        // make sure the user actually exists
        const user = await User?.findOne({where: { username }, attributes: ['username', 'password', 'email', 'display_name']});
        if (!user) return undefined;

        // if there's a match, return the user's information

        // TODO: decide whether we want to include user's password, created_at, updated_at

        const match = await compare(password, user.password);
        if (match) return {
            username: user.username,
            email: user.email,
            display_name: user.display_name
        }

        return undefined;
    }
}

export default UserService;