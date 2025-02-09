import { FavoriteSearch } from '../interfaces/FavoriteSearch';
import { useState, useEffect } from 'react';
import '../index.css';
import { getFavorites } from '../api/appApi';
import auth from '../utils/auth';
import { deleteFavorite } from '../api/appApi';


export default function SavedDestination() {    
    const [favorites, setFavorites] = useState<FavoriteSearch[]>([]);
    const handleRemove = (favoriteIdToRemove: number) => {
        const profile = auth.getProfile();
        if (profile && typeof profile.id === "number") {
            const userId = profile.id; // Base 10 to ensure proper parsing
            console.log('userId:', userId);
            if (!isNaN(userId)) {
                deleteFavorite(userId, favoriteIdToRemove)
                    .then(() => {
                    getFavorites(userId)
                        .then((favorites) => {
                            setFavorites(favorites);
                        })
                        .catch((err) => {
                            console.error("Error getting favorites:", err);
                        });
                    })
                    .catch((err) => {
                        console.error("Error deleting favorite:", err);
                    });
            }
    }};
    
    useEffect(() => {
        const profile = auth.getProfile();
        console.log('Profile:', profile);
        if (profile && typeof profile.id === "number") {
            const userId = profile.id; // Base 10 to ensure proper parsing
            console.log('userId:', userId);
            if (!isNaN(userId)) {
                getFavorites(userId)
                    .then((favorites) => {
                        setFavorites(favorites);
                    })
                    .catch((err) => {
                        console.error("Error getting favorites:", err);
                    });
            }
        }
    }, []);

    useEffect(() => {
        console.log('Favorites:', favorites);
    }, [favorites]);

    // useEffect(() => {
    //     const sampleFavoritesData = [
    //         {
    //             destination: 'Paris',
    //             date: new Date('2022-01-01'),
    //             weatherResponse: 'Sunny',
    //             placesResponse: 'Eiffel Tower, Louvre'
    //         },
    //         {
    //             destination: 'New York',
    //             date: new Date('2022-02-01'),
    //             weatherResponse: 'Rainy',
    //             placesResponse: 'Statue of Liberty, Central Park'
    //         }
    //     ]

    //     setFavorites(sampleFavoritesData);
    // }, []);

    return (
        <div className="table-container">
            <table className="favorites-table">
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Weather</th>
                        <th>Places to Visit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.length > 0 ? (
                        favorites.map((favorite, index) => (
                            <tr key={index}>
                                <td>{favorite.destination}</td>
                                <td>{new Date(favorite.date).toLocaleDateString()}</td>
                                <td>{favorite.weatherResponse || 'No weather data'}</td>
                                <td>{favorite.placesResponse || 'No places data'}</td>
                                <td>
                                <button 
                                        className="btn-remove" 
                                        type="button" 
                                        onClick={() => handleRemove(index)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="no-data">No saved destinations</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}