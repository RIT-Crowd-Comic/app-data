import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from "sequelize";
import { sql } from '@sequelize/core';
import { INTEGER } from "@sequelize/core/_non-semver-use-at-your-own-risk_/dialects/abstract/data-types.js";
import sequelize from "..";

interface IHook extends Model<InferAttributes<IHook>, InferCreationAttributes<IHook>> {
    id: CreationOptional<INTEGER>,
    position: Float32Array;
    current_panel_id: ForeignKey<INTEGER>,
    next_panel_set_id: ForeignKey<INTEGER>
}

let Hook: ModelStatic<IHook> | undefined;

const define = (sequelize: Sequelize): void => {
    Hook = sequelize.define<IHook>(
        'hook',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            position: {
                type: DataTypes.ARRAY(DataTypes.FLOAT),
                allowNull: false
            },
            current_panel_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            next_panel_set_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                unique: true
            }
        }
    );
}

export {define, Hook, type IHook};