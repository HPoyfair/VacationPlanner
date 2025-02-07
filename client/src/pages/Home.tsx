/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useLayoutEffect } from "react";
import auth from '../utils/auth.js';
import { getCoordinates, getWeather } from "../api/weatherApi";
import { getPlaces } from "../api/placesApi";
//import axios from "axios"; // For the search API call
import '../index.css';
import { saveFavorite } from '../api/appApi.js'
import { UserData } from '../interfaces/UserData';
import WeatherDisplay from "../components/WeatherDisplay.js";
import SearchBar from "../components/searchBar.js";
import RecommendationCard from "../components/recommendationCard.js";
import WeatherResponse from "../interfaces/WeatherResponse.js";

interface SearchResults {
    weatherResponse: WeatherResponse;
    placesResponse: string;
}

const Home = () => {

    //States for user login
    const [user, setUser] = useState<UserData>({
        id: 0,
        username: "",
        email: "",
    })

    const [loginCheck, setLoginCheck] = useState(false);

    // States for search bar
    const [destination, setDestination] = useState<string>("");
    const [date, setDate] = useState<string>("");
    console.log(typeof date);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [searchError, setSearchError] = useState<string>("");

    interface Recommendation {
        id: string;
        image: string;
        name: string;
        rating: number;
        location: string;
        price: string;
    }

    const [hotels, setHotels] = useState<Recommendation[]>([]);
    const [restaurants, setRestaurants] = useState<Recommendation[]>([]);
    const [entertainment, setEntertainment] = useState<Recommendation[]>([]);

    useEffect(() => {
        if (loginCheck) {
            fetchUser();
        }
    }, [loginCheck]);

    useLayoutEffect(() => {
        checkLogin();
    }, []);

    // useEffect(() => {
    //     if (!destination) return;

    //     const fetchRecommendations = async () => {
    //         try {
    //             const hotelResponse = await axios.get('/api/recommendations?category=hotels&destination=${destination}');
    //             const restaurantResponse = await axios.get('/api/recommendations?category=restaurants&destination =${destination}');
    //             const entertainmentResponse = await axios.get('/api/recommendations?category=entertainment&destination=${destination}');

    //             setHotels(hotelResponse.data);
    //             setRestaurants(restaurantResponse.data);
    //             setEntertainment(entertainmentResponse.data);
    //         } catch (error) {
    //             console.error("Error fetching recommendations:", error);
    //         }
    //     };

    //     fetchRecommendations();
    // }, [destination]);


    const checkLogin = () => {
        if (auth.loggedIn()) {
            setLoginCheck(true);
        }
    };

    const fetchUser = () => {
        setUser(auth.getProfile());
    }


    const handleSearch = async () => {
        setHotels([]);
        setRestaurants([]);
        setEntertainment([]);

        if (!destination || !date) {
            alert("Please enter both location and date.");
            return;
        }

        try {
            // Get latitude and longitude for the Location
            const location = await getCoordinates(destination);

            // Call the Weather API with the given coordinates and date
            const weather = await getWeather(location.lat, location.lon, date);

            const places = await getPlaces(location.lat, location.lon);

            // TODO: Make an API call to the server
            // const response = await axios.get("http://localhost:3000/api/", {
            //     params: { location, date }
            // });
            setSearchResults({ weatherResponse: weather, placesResponse: JSON.stringify(places)} ); // Store the search results
            setSearchError(""); // Clear any previous search errors
        } catch (error) {
            console.error(error);
            setSearchError("Error fetching data. Try again.");
        }
    };

    const saveItinerary = async () => {
        try {
            if (!user.id) {
                console.error("User ID is null or undefined. Cannot save itinerary.");
                return;
            }

            const itineraryDate = new Date(date); // Ensure date is a Date object

            const response = await saveFavorite({
                destination: destination,
                date: itineraryDate,
                weatherResponse: "weatherResponse",
                placesResponse: "placesResponse"
            }, user.id); // Now user.id is guaranteed to be a number

            console.log(response);
        } catch (error) {
            console.error("Error saving itinerary:", error);
        }
    };

    return (
        <div>
            <SearchBar
                destination={destination}
                setDestination={setDestination}
                date={date}
                setDate={setDate}
                handleSearch={handleSearch}
            />
            {/* Error Message for Search */}
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
    
            {/* Display Search Results */}
            {searchResults && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-lg font-bold">Search Results:</h2>
                    <WeatherDisplay weather={searchResults.weatherResponse} />                    
                    <h2>Places Result:</h2>
                    {/* TODO: Parse results into something useable and display a card for each place */}
                    <p>{searchResults.placesResponse}</p>
                </div>
            )}
    
            <div className="recommendation-container">
                <h2>Top Hotels</h2>
                <div className="recommendation-grid">
                    {hotels.map((hotel) => <RecommendationCard key={hotel.id} recommendation={hotel} />)}
                </div>
            </div>
    
            <div className="recommendation-container">
                <h2>Top Restaurants</h2>
                <div className="recommendation-grid">
                    {restaurants.map((restaurant) => <RecommendationCard key={restaurant.id} recommendation={restaurant} />)}
                </div>
            </div>
    
            <div className="recommendation-container">
                <h2>Top Entertainment</h2>
                <div className="recommendation-grid">
                    {entertainment.map((ent) => <RecommendationCard key={ent.id} recommendation={ent} />)}
                </div>
            </div>
    
            <div>
                <button onClick={saveItinerary}>Save Itinerary</button>
            </div>
        </div>
    );
    
};

export default Home;