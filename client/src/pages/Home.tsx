import { useState, useEffect, useLayoutEffect } from "react";
import React from "react";
import auth from '../utils/auth';
import { getCoordinates, getWeather } from "../api/weatherApi";
//import axios from "axios"; // For the search API call
import ErrorPage from "./ErrorPage";
import '../index.css';
import WeatherResponse from "../interfaces/WeatherResponse";
import WeatherDisplay from "../components/WeatherDisplay";

interface SearchResults {
    weatherResults: WeatherResponse;
}

const Home = () => {

    //States for user login
    const [user, setUser] = useState('');
    const [loginCheck, setLoginCheck] = useState(false);

    // States for search bar
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [searchError, setSearchError] = useState("");    
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
        setUser(auth.getUsername());
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
            
            // TODO: Make an API call to the server
            // const response = await axios.get("http://localhost:3000/api/", {
            //     params: { location, date }
            // });
            
            setSearchResults({ weatherResults: weather });
            
            // setSearchError(""); // Clear any previous search errors
        } catch (error) {
            console.error(error);
            setSearchError("Error fetching data. Try again.");
        }
    };

    if (searchError) {
        return <ErrorPage />;
    }

    // Recommendation Card Component to display each recommendation
    const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => (
        <div className="recommendation-card">
            <img src={recommendation.image} alt={recommendation.name} />
            <h3>{recommendation.name}</h3>
            <p>{recommendation.location}</p>
            <p className="rating">⭐ {recommendation.rating}</p>
            <p className="price">{recommendation.price}</p>
        </div>
    );

    return (
        <>
            {/* Search Bar Section */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {/* Error Message for Search */}
            {searchError && <p className="text-red-500 mt-2">{searchError}</p>}

            {/* Display Search Results */}
            {searchResults && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h2 className="text-lg font-bold">Search Results:</h2>
                    <WeatherDisplay weather={searchResults.weatherResults} />                    
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


            {/* User List Section */}
            {
                !loginCheck ? (
                    <div className='login-notice'>
                        {/* <p>
                            Login to save your favorite destinations!
                        </p> */}
                    </div>
                ) : (
                    <p>Welcome, {user}.</p>
                )}
        </>
    );
};

export default Home;