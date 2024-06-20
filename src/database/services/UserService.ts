import { User } from '../models'
import { hash, compare } from 'bcrypt'
import PasswordValidator from 'password-validator';
import { ValidationError } from 'sequelize';

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
 * Checks if a password is valid. On fail, return an error message or message[]
 * @param password 
 * @param errorPrefix optionally include a prefix to the validation error messages
 * @returns 
 */
const validatePassword = (password: string, errorPrefix?: string): AuthenticateFail | AuthenticateSuccess => {
    const validation = passwordSchema.validate(password, { details: true });

    if (validation === false) return {
        success: false,
        message: 'Invalid password'
    } as AuthenticateFail;

    // validation contains an array of error messages
    if (typeof validation === 'object' && (validation.length ?? -1) > 0) {
        const message = typeof validation === 'object' ? validation.map(o => `${errorPrefix ?? ''} ${o?.message}`) : "Invalid password"
        return { success: false, message } as AuthenticateFail;
    }

    // validation contains an empty array or returns true
    // success!
    if (validation === true || typeof validation === 'object' && (validation.length ?? -1) === 0) {
        return { success: true } as AuthenticateSuccess;
    }

    // assume the password doesn't validate
    return { success: false, message: 'Invalid password' } as AuthenticateFail;
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
            return { username, display_name, email, success: true } as AuthenticateSuccess;
        }
        catch (err) {
            if (err instanceof ValidationError)
                return {
                    success: false,
                    message: err.message
                } as AuthenticateFail;
            return {
                success: false,
                message: 'Something went wrong'
            } as AuthenticateFail;
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
        } as AuthenticateFail;

        // if there's a match, return the user's information

        // TODO: decide whether we want to include user's password, created_at, updated_at

        const match = await compare(password, user.password);
        if (match) return {
            username: user.username,
            email: user.email,
            display_name: user.display_name,
            success: true
        } as AuthenticateSuccess;

        return {
            success: false,
            message: "Username or password is invalid"
        } as AuthenticateFail;
    }

    /**
     * Change the password for a user
     * @param username 
     * @param currentPassword 
     * @param newPassword 
     */
    static async changePassword(username: string, currentPassword: string, newPassword: string): Promise<AuthenticateSuccess | AuthenticateFail> {

        // ensure new password is not the same
        if (currentPassword === newPassword) {
            return {
                success: false,
                message: "New password must not be the same as the old password"
            } as AuthenticateFail;
        }

        // validate password
        const passwordValidation = validatePassword(newPassword, 'new');
        if (passwordValidation.success === false) return passwordValidation;

        // check if current username/password are correct
        const auth = await this.authenticate(username, currentPassword);
        if (auth.success === false) {
            return {
                success: false,
                message: auth.message
            } as AuthenticateFail;
        }

        // update the user's password
        const user = await User.findOne({ where: { username } });
        try {
            await user?.update({password: await hash(newPassword, PASSWORD_SALT_ROUNDS)});

            return {
                success: true,
                message: "Password changed successfully"
            } as AuthenticateSuccess;
        }
        catch {
            return {
                success: false,
                message: 'Something went wrong'
            } as AuthenticateFail;
        }
        // finally {
        //     return {
        //         success: false,
        //         message: "Something went wrong"
        //     }  as AuthenticateFail;
        // }
    }

    static async changeUsername(username: string, password: string, newUsername: string): Promise<AuthenticateSuccess | AuthenticateFail> {

        // make sure new username is not the same
        if (username === newUsername) {
            return {
                success: false,
                message: "New username must not be the same as the old username"
            } as AuthenticateFail;
        }

        // check if current username/password are correct
        const auth = await this.authenticate(username, password);
        if (auth.success === false) {
            return {
                success: false,
                message: auth.message
            } as AuthenticateFail;
        }

        // update the user's username
        const user = await User.findOne({ where: { username } });
        try {
            await user?.update({username: newUsername});

            return {
                success: true,
                message: `Username changed to '${user?.username}'`
            } as AuthenticateSuccess;
        }
        catch {
            return {
                success: false,
                message: 'Something went wrong'
            } as AuthenticateFail;
        }
    }
}

export default UserService;