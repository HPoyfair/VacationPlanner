import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFavorite } from "../api/appApi";
import { getCoordinates, getWeather } from "../api/weatherApi";
import { getPlaces } from "../api/placesApi";
import { parsePlacesResponse } from "../utils/parsePlaces.js";
import { PlaceData } from "../interfaces/PlaceData";
import "../index.css";
import WeatherResponse from "../interfaces/WeatherResponse.js";
import WeatherDisplay from "../components/WeatherDisplay.js";


interface SearchResults {
    weatherResponse: WeatherResponse;
    placesResponse: PlaceData[];
}

interface Recommendation {
    id: string;
    image: string;
    name: string;
    rating: number;
    location: string;
    price: string;
}

const SavedDestination = () => {
    const { id } = useParams();


    const [searchResults, setSearchResults] = useState<SearchResults | null>(
        null
    );
    const [searchError, setSearchError] = useState<string>("");
    const [destination, setDestination] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [hotels, setHotels] = useState<Recommendation[]>([]);
    const [restaurants, setRestaurants] = useState<Recommendation[]>([]);
    const [entertainment, setEntertainment] = useState<Recommendation[]>([]);
    const [weatherFetched, setWeatherFetched] = useState<boolean>(false);


    useEffect(() => {
        const numericId = Number(id); // Convert string to number safely

        if (!isNaN(numericId)) { // Ensure it's a valid number before calling API
            getFavorite(numericId)
                .then((favorite) => {
                    console.log(favorite);
                    setDestination(favorite.destination);
                    setDate(new Date(favorite.date).toISOString().split("T")[0]);
                })
                .catch((err) => {
                    console.error("Error getting favorite:", err);
                    setSearchError("Error fetching favorite data. Try again.");
                });
        } else {
            console.error("Invalid ID:", id);
        }
    }, [id]);

    useEffect(() => {
        if (destination && date && !weatherFetched) {
            setWeatherFetched(true);
            handleSearch();
        }
    }, [destination, date]);

 


    const handleSearch = async () => {
        setHotels([]);
        setRestaurants([]);
        setEntertainment([]);

        if (!destination || !date) {
            alert("Please enter both location and date.");
            return;
        }

        try {
            const location = await getCoordinates(destination);
            console.log('location:', location);
            console.log ('date:', date);
            console.log('destination:', destination);
            const weather = await getWeather(location.lat, location.lon, date);
            console.log('weather:', weather);
            const places = await getPlaces(location.lat, location.lon);
            console.log('places:', places);

            const parsedPlaces = await parsePlacesResponse(places);

            if (!parsedPlaces) {
                setSearchError("Error fetching places data. Try again.");
                return;
            }

            setHotels([
                {
                    id: "1",
                    image: parsedPlaces[0].photoUrl,
                    name: parsedPlaces[0].name,
                    rating: 5,
                    location: parsedPlaces[0].address,
                    price: "$$$",
                },
            ]);

            setRestaurants([
                {
                    id: "2",
                    image: parsedPlaces[1].photoUrl,
                    name: parsedPlaces[1].name,
                    rating: 4.5,
                    location: parsedPlaces[1].address,
                    price: "$$",
                },
            ]);

            setEntertainment([
                {
                    id: "3",
                    image: parsedPlaces[2].photoUrl,
                    name: parsedPlaces[2].name,
                    rating: 4,
                    location: parsedPlaces[2].address,
                    price: "$",
                },
            ]);

            setSearchResults({
                weatherResponse: weather,
                placesResponse: parsedPlaces,
            });
            setSearchError("");
        } catch (error) {
            console.error("Error fetching data:", error);
            setSearchError("Error fetching data. Try again.");
        }
    };



    useEffect(() => {
        console.log('searchId:', id);
    }, []);

    return (
        <div>
            <h2>{destination}</h2>
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}

            {searchResults && (
                <div>
                    <div className="mt-4 p-4 border rounded bg-gray-100">



                        <WeatherDisplay weather={searchResults.weatherResponse} />
                    </div>
                    <div className="recommendations-section">
                        <h2 className="text-center text-xl font-bold mb-4">Local Recommendations</h2>
                        <div className="results-container">
                            <div className="results-box">
                                {hotels.map((hotel) => (
                                    <div className="result-card" key={hotel.id}>
                                        <img src={hotel.image} alt={hotel.name} />
                                        <p><strong>{hotel.name}</strong></p>
                                        <p>{hotel.location}</p>
                                        <p className="card-price">{hotel.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="results-box">
                                {restaurants.map((restaurant) => (
                                    <div className="result-card" key={restaurant.id}>
                                        <img src={restaurant.image} alt={restaurant.name} />
                                        <p><strong>{restaurant.name}</strong></p>
                                        <p>{restaurant.location}</p>
                                        <p className="card-price">{restaurant.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="results-box">
                                {entertainment.map((ent) => (
                                    <div className="result-card" key={ent.id}>
                                        <img src={ent.image} alt={ent.name} />
                                        <p><strong>{ent.name}</strong></p>
                                        <p>{ent.location}</p>
                                        <p className="card-price">{ent.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default SavedDestination;