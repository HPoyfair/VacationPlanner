// import { FavoriteSearch } from '../interfaces/FavoriteSearch';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import '../index.css';
import { getFavorites } from '../api/appApi';
import { deleteFavorite } from '../api/appApi';
import { SavedFavoriteSearch } from '../interfaces/FavoriteSearch';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

export default function SavedDestinations() {
    const [favorites, setFavorites] = useState<SavedFavoriteSearch[]>([]);
    const handleRemove = (favoriteIdToRemove: number) => {        
        deleteFavorite(favoriteIdToRemove)
            .then(() => {
                getFavorites()
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
    };

    useEffect(() => {
        getFavorites()
        .then((favorites) => {
            setFavorites(favorites);
        })
        .catch((err) => {
            console.error("Error getting favorites:", err);
        });
    }, []);

    useEffect(() => {
        console.log('Favorites:', favorites);
    }, [favorites]);


    if (!Auth.loggedIn()) {        
        Navigate({ to: '/login' });
        return;
    }

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