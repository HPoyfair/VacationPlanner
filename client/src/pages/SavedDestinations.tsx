import { FavoriteSearch } from '../interfaces/FavoriteSearch';
import { useState, useEffect } from 'react';
import '../index.css';


export default function SavedDestination() {    
    const [favorites, setFavorites] = useState<FavoriteSearch[]>([]);
    const handleRemove = (indexToRemove: number) => {
        setFavorites(favorites.filter((_, index) => index !== indexToRemove));
    };
    
    useEffect(() => {
        const sampleFavoritesData = [
            {
                destination: 'Paris',
                date: new Date('2022-01-01'),
                weatherResponse: 'Sunny',
                placesResponse: 'Eiffel Tower, Louvre'
            },
            {
                destination: 'New York',
                date: new Date('2022-02-01'),
                weatherResponse: 'Rainy',
                placesResponse: 'Statue of Liberty, Central Park'
            }
        ]

        setFavorites(sampleFavoritesData);
    }, []);

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