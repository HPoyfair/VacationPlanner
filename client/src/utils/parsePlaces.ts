import { PlaceData } from "../interfaces/PlaceData";
import { getPhoto } from "../api/placesApi";

interface Photo {
    photo_reference: string;
    width: number;
    height: number;
}

interface PlaceResult {
    name: string;
    vicinity: string;
    photos: Array<Photo>;
    rating: number;
    user_ratings_total: number;
}

interface PlacesResult {
    results: Array<PlaceResult>;
}

const parsePlacesResponse = async (response: Array<PlacesResult>) => {
    if (!response || response.length !== 3) {
        return;
    }

    const types = ['Hotel', 'Restaurant', 'Entertainment'];
    
    // Response will always be a 3-length array of Hotel, Restaurant, and Tourist Attraction locations

    const result: Array<PlaceData> = [];

    for (let i = 0; i < 3; i++) {
        const record = response[i];        

        let filteredResults = record.results.filter((result) => {
            return result.photos && result.photos.length > 0 && result.rating && result.user_ratings_total >= 10;
        });

        if (filteredResults.length === 0) {
            filteredResults = record.results;
        }

        const topResult = filteredResults.sort((a, b) => {
            return b.rating - a.rating;
        })[0];

        result.push({
            type: types[i],
            name: topResult.name,
            photoUrl: await getPhoto(topResult.photos[0].photo_reference, 400),
            address: topResult.vicinity,
            rating: topResult.rating,
            userRatings: topResult.user_ratings_total
        });
    }

    return result;
}

export { parsePlacesResponse };