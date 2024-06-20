import { User } from '../models'
import { hash, compare } from 'bcrypt'
import PasswordValidator from 'password-validator';

const PASSWORD_SALT_ROUNDS = 10;

// /**
//  * matches at least 1 lowercase, at least 1 uppercase, at least 1 number, at least 1 symbol
//  */
// const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]\{\}]).{8,30}$/

const passwordSchema = new PasswordValidator();
passwordSchema
.is().min(8, 'password should have a minimum of 8 characters')
.is().max(30, 'password should have a maximum of 30 characters')
.has().uppercase(1, 'password should have an uppercase character')
.has().lowercase(1, 'password should have a lowercase character')
.has(/[\d!@#$%^&*()\-=_+\[\]\{\}]/, 'password should include a number or symbol')
.has().not().spaces();

/**
 * Information required to create a new user
 */
interface UserConfig {
    username: string,
    password: string,
    email: string,
    display_name: string,
}

interface AuthenticateFail {
    /**
     * always use the comparison `success === false` or `success === true`
     */
    success: boolean,
    message?: string | string[];
}

interface AuthenticateSuccess {
    success: boolean,
    [key: string]: any
}

/**
 * Checks if a password is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix optionally include a prefix to the validation error messages
 * @returns 
 */
const validatePassword = (password: string, errorPrefix?: string ): AuthenticateFail | AuthenticateSuccess => {
    const validation = passwordSchema.validate(password, { details: true });

    if (validation === false) return {
        success: false,
        message: 'Invalid password'
    };

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : "Invalid password"
        return {
            success: false,
            message
        }
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return {success: true};
    }

    // assume the password doesn't validate
    return { success: false, message: 'Invalid password' };
}

/**
 * Perform queries on the 'users' table
 */
class UserService {

    /**
     * Create a new user
     * @param {} newUser 
     */
    static async createUser(newUser: UserConfig): Promise<AuthenticateSuccess | AuthenticateFail> {

        // validate password
        const passwordValidation = validatePassword(newUser.password);
        if (passwordValidation.success === false) return passwordValidation;

        try {
            // deconstruct the response to ensure only wanted data is returned
            const { username, display_name, email } = await User.create({
                username: newUser.username,
                display_name: newUser.display_name,
                password: await hash(newUser.password, PASSWORD_SALT_ROUNDS),
                email: newUser.email,
            });
            return { username, display_name, email, success: true };
        }
        catch (err) {
            return {
                success: false,
                message: (err as Error).message
            };
        }
    }

    /**
     * Authenticate a user before retrieve the user's data
     * @param username 
     * @param password un-hashed password
     * @returns 
     */
    static async authenticate(username: string, password: string): Promise<AuthenticateSuccess | AuthenticateFail> {
        // make sure the user actually exists
        const user = await User.findOne({ where: { username: username }, attributes: ['username', 'password', 'email', 'display_name'] });
        if (!user) return {
            success: false,
            message: "Username or password is invalid"
        };

        // if there's a match, return the user's information

        // TODO: decide whether we want to include user's password, created_at, updated_at

        const match = await compare(password, user.password);
        if (match) return {
            username: user.username,
            email: user.email,
            display_name: user.display_name,
            success: true
        }

        return {
            success: false,
            message: "Username or password is invalid"
        };
    }

    /**
     * Change the password for a user
     * @param username 
     * @param currentPassword 
     * @param newPassword 
     */
    static async changePassword(username: string, currentPassword: string, newPassword: string): Promise<AuthenticateSuccess | AuthenticateFail> {

        // validate password
        const passwordValidation = validatePassword(newPassword, 'new');
        if (passwordValidation.success === false) return passwordValidation;

        // check if current username/password are correct
        const auth = await this.authenticate(username, currentPassword);
        if (auth.success === false) {
            return {
                success: false,
                message: auth.message
            };
        }

        // update the user's password
        const user = await User.findOne({ where: { username } });
        try {
            await user?.update('password', await hash(newPassword, PASSWORD_SALT_ROUNDS));

            return {
                success: true,
                message: "Password changed successfully"
            };
        }
        finally {
            return {
                success: false,
                message: "Something went wrong"
            };
        }

    }
}

export default UserService;