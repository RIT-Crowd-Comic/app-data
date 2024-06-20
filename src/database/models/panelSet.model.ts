import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic, Sequelize } from "sequelize";
import { sql } from '@sequelize/core'
import sequelize from "..";
import { AllowNull, ForeignKey, PrimaryKey } from "sequelize-typescript";


interface IPanelSet extends Model<InferAttributes<IPanelSet>, InferCreationAttributes<IPanelSet>> {
    id: number,
    author_id: string
}

let PanelSet: ModelStatic<IPanelSet> | undefined;
const define = (sequelize: Sequelize): void => {
    PanelSet = sequelize.define<IPanelSet>(
        'panel_set',
        {
            id: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                primaryKey: true
            },
            author_id: {
                type: DataTypes.UUID,
                allowNull: false,
            }
        },
        {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
}

export { define, PanelSet, type IPanelSet };