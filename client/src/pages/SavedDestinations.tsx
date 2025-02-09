// import { FavoriteSearch } from '../interfaces/FavoriteSearch';
import { useState, useEffect } from 'react';
import '../index.css';
import { getFavorites } from '../api/appApi';
import auth from '../utils/auth';
import { deleteFavorite } from '../api/appApi';
import { SavedFavoriteSearch } from '../interfaces/FavoriteSearch';
import { Link } from 'react-router-dom';


export default function SavedDestinations() {
    const [favorites, setFavorites] = useState<SavedFavoriteSearch[]>([]);
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
        }
    };

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


    return (
        <div className="table-container">
            <table className="favorites-table">
                <thead>
                    <tr>
                        <th>Destination</th>
                        <th>Date</th>
                        {/* <th>Weather</th>
                        <th>Places to Visit</th> */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.length > 0 ? (
                        favorites.map((favorite, index) => (
                            <tr key={index}>
                                <td>{favorite.destination}</td>
                                <td>{new Date(favorite.date).toLocaleDateString()}</td>
                                {/* <td>{favorite.weatherResponse || 'No weather data'}</td>
                                <td>{favorite.placesResponse || 'No places data'}</td> */}
                                <td>
                                    <Link to={`/view-destination/${favorite.id}`}>
                                    <button
                                        className="btn-view">
                                        View
                                    </button>
                                    </Link>
                                    <button
                                        className="btn-remove"
                                        type="button"
                                        onClick={() => handleRemove(favorite.id)}
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