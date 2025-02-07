import { FavoriteSearch } from '../interfaces/FavoriteSearch';
import { useState, useEffect } from 'react';


export default function SavedDestination() {    
    const [favorites, _setFavorites] = useState<FavoriteSearch[]>([]);
    const handleRemove = () => { }
    
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

        _setFavorites(sampleFavoritesData);
    }, []);

    return (
        <table>
            <tbody>
                {favorites.map((favorite, index) => (
                    <tr key={index}>
                        <td>{favorite.destination}</td>
                        <td>{new Date(favorite.date).toLocaleDateString()}</td>
                        <td>{favorite.weatherResponse || 'No weather data'}</td>
                        <td>{favorite.placesResponse || 'No places data'}</td>
                        <td>
                            <button onClick={handleRemove}>Remove</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}