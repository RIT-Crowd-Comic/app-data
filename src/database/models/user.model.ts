import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from "sequelize";

// alternatively
// class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
//     declare id: string;
//     declare username: string;
//     // etc....

//     get exampleGetter(): NonAttribute<string> {
//         return `${this.username} (${this.display_name})`;
//     }
    
//     declare static associations: { model: Association<Model<any, any>, Model<any, any>>; };
// }

// User.init({
//     id: {type: DataTypes.UUID, primaryKey: true},
//     username: {type: DataTypes.STRING},
// },
//     {
//         sequelize,
//         tableName: 'users'
//     }
// );

// interface UserAttributes {
//     id: string,
//     username: string,
//     display_name: string,
//     email: string,
//     password: string,
// }

interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
    id: CreationOptional<string>,
    username: string,
    display_name: string,
    email: string,
    password: string,
}


// type UserCreationAttributes = Optional<UserAttributes, 'example_attribute'>;

let User: ModelStatic<IUser>;


const define = (sequelize: Sequelize): void => {
    User = sequelize.define<IUser>(
        'user',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    // username can contain any of the following characters, with length 8-20
                    is: /^[a-zA-Z0-9!@#$%^&*()\-=_+\[\]\{\}]{8,30}$/
                }
            },
            display_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: {msg: 'must be a valid email'}
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                // don't validate password here because it's a hash
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
}

export { define, User, type IUser };