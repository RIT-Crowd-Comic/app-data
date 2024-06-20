import { AddPrimaryKeyConstraintOptions, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from "sequelize";
import { sql } from '@sequelize/core'
import { TimestampAttributes } from "@sequelize/core/_non-semver-use-at-your-own-risk_/model-definition.js";
import { INTEGER, SMALLINT, TINYINT } from "@sequelize/core/_non-semver-use-at-your-own-risk_/dialects/abstract/data-types.js";


interface IPanel extends Model<InferAttributes<IPanel>, InferCreationAttributes<IPanel>> {
    id: CreationOptional<INTEGER>,
    image: String,
    index: SMALLINT,
    panel_set_id: ForeignKey<INTEGER>
}



let Panel: ModelStatic<IPanel> | undefined;


const define = (sequelize: Sequelize): void => {
    Panel = sequelize.define<IPanel>(
        'panel',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            index: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            panel_set_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
}

export { define, Panel, type IPanel };