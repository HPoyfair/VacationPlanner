import sequelize from '../config/connection.js'
import { UserFactory } from './user.js';
import { FavoriteSearchFactory } from './favoriteSearch.js';

const User = UserFactory(sequelize);
const FavoriteSearch = FavoriteSearchFactory(sequelize);

// Create a one-to-many relationship between User and FavoriteSearch
User.hasMany(FavoriteSearch, {
    onDelete: 'CASCADE',
});

FavoriteSearch.belongsTo(User);

export { User, FavoriteSearch };
