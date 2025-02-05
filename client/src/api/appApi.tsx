import { FavoriteSearch } from "../interfaces/FavoriteSearch"
import Auth from '../utils/auth';

// Store a favorite search for a user
const saveFavorite = async (data: FavoriteSearch, userId: number) => {
    try {
        const response = await fetch(`/api/${userId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Auth.getToken()}`
            },
            body: JSON.stringify(data)
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }
    
        const responseData = await response.json();
    
        return responseData;
    } catch (err) {
        console.log('Error from saveFavorite: ', err);
        return Promise.reject(err);
    }
}

// Get all favorite searches for a user
const getFavorites = async (userId: number) => {
    try {
        const response = await fetch(`/api/${userId}/favorites`, {
            headers: {                
                Authorization: `Bearer ${Auth.getToken()}`
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }
    
        const responseData = await response.json();
    
        return responseData;
    } catch (err) {
        console.log('Error from getFavorites: ', err);
        return Promise.reject(err);
    }
}

// Delete a favorite search for a user
const deleteFavorite = async (userId: number, favoriteId: number) => {
    try {
        const response = await fetch(`/api/${userId}/favorite/${favoriteId}`, {
            method: 'DELETE',
            headers: {                
                Authorization: `Bearer ${Auth.getToken()}`
            }
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`${errorData.message}`);
        }
    } catch (err) {
        console.log('Error from deleteFavorite: ', err);
        return Promise.reject(err);
    }
}

export { saveFavorite, getFavorites, deleteFavorite };