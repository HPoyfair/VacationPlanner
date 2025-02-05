import { User, FavoriteSearch } from '../models/index.js';
import userData from './userSeedData.json' with { type: 'json' };
import savedSearchData from './savedSearchSeedData.json' with { type: 'json' };

export const seedUsers = async () => {
  const users = await User.bulkCreate(userData, {
    individualHooks: true, returning: true, validate: true
  });

  for (const record of savedSearchData) {
    // Assign to random user
    const user = users[Math.floor(Math.random() * users.length)];    

    await FavoriteSearch.create({
      destination: record.destination,
      date: new Date(record.date),
      weatherResponse: JSON.stringify(record.weatherResponse),
      placesResponse: JSON.stringify(record.placesResponse),
      userId: user.id
    });
  }
};
