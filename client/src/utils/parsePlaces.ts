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
}

interface PlacesResult {
    results: Array<PlaceResult>;
}

const parsePlacesResponse = async (response: Array<PlacesResult>) => {


    if (!response || response.length !== 3) {
        return;
    }
    
    // Response will always be a 3-length array of Hotel, Restaurant, and Tourist Attraction locations
    const result: Array<PlaceData> = [
        {
            type: "Hotel",
            name: response[0].results[0].name,
            photoUrl: await getPhoto(response[0].results[0].photos[0].photo_reference, 400),
            address: response[0].results[0].vicinity
        },
        {
            type: "Restaurant",
            name: response[1].results[0].name,
            photoUrl: await getPhoto(response[1].results[0].photos[0].photo_reference, 400),
            address: response[1].results[0].vicinity
        },
        {
            type: "Entertainment",
            name: response[2].results[0].name,
            photoUrl: await getPhoto(response[2].results[0].photos[0].photo_reference, 400),
            address: response[2].results[0].vicinity
        },
    ];

    return result;
}

export { parsePlacesResponse };