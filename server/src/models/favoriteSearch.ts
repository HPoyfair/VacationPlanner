import {
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    DataTypes,
    type Sequelize,
    type ForeignKey,
} from 'sequelize';

import type { User } from './user';

// Define the FavoriteSearch class extending Sequelize's Model
export class FavoriteSearch extends Model<
    InferAttributes<FavoriteSearch>,
    InferCreationAttributes<FavoriteSearch>
> {
    declare id: CreationOptional<number>;
    declare destination: string;
    declare date: Date;
    declare weatherResponse: string; // Holds the API response from the open weather API
    declare placesResponse: string; // Holds the API response from the Google Places API

    // Foreign key to Users table
    declare userId: ForeignKey<User['id']>;
}

export function FavoriteSearchFactory(sequelize: Sequelize) {
    FavoriteSearch.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            destination: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            weatherResponse: {
                type: DataTypes.STRING(10000),
                allowNull: false,
            },
            placesResponse: {
                type: DataTypes.STRING(10000),
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: 'favorite_searches',
            sequelize,
            underscored: true,
            timestamps: false
        }
    );

    return FavoriteSearch;
}