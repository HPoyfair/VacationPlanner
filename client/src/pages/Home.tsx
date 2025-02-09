import { useState, useEffect, useLayoutEffect } from "react";
import auth from "../utils/auth.js";
import { getCoordinates, getWeather } from "../api/weatherApi";
import { getPlaces } from "../api/placesApi";
import { parsePlacesResponse } from "../utils/parsePlaces.js";
import { PlaceData } from "../interfaces/PlaceData";
import "../index.css";
import { saveFavorite } from "../api/appApi.js";
import { UserData } from "../interfaces/UserData";
import WeatherDisplay from "../components/WeatherDisplay.js";
import SearchBar from "../components/searchBar.js";
import WeatherResponse from "../interfaces/WeatherResponse.js";
import { Link } from "react-router-dom";
import { store, getStored, clearStore } from "../utils/localStore.js";

interface SearchResults {
  weatherResponse: WeatherResponse;  
}

interface Recommendation {
  id: string;
  image: string;
  name: string;
  rating: number;
  location: string;
  reviews: number;
}

const Home = () => {
  const [user, setUser] = useState<UserData>({
    id: 0,
    username: "",
    email: "",
  });

  const [loginCheck, setLoginCheck] = useState(false);

  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [weatherResults, setWeatherResults] = useState<SearchResults | null>(
    null
  );
  const [searchError, setSearchError] = useState<string>("");

  const [hotels, setHotels] = useState<Recommendation[]>([]);
  const [restaurants, setRestaurants] = useState<Recommendation[]>([]);
  const [entertainment, setEntertainment] = useState<Recommendation[]>([]);

  const [itinerarySaved, setItinerarySaved] = useState(false);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  useEffect(() => {
    if (loginCheck) {
      fetchUser();
    }
  }, [loginCheck]);

  useLayoutEffect(() => {
    checkLogin();

    const storedData = getStored();

    if (storedData && storedData.places && storedData.weather) {
      setDestination(storedData.search || "");
      setDate(storedData.date.toISOString());
      populatePlaces(JSON.parse(storedData.places));
      setWeatherResults({weatherResponse: JSON.parse(storedData.weather)});
    }
  }, []);

  const populatePlaces = async (parsedPlaces:PlaceData[]) => {
      setHotels([
        {
          id: "1",
          image: parsedPlaces[0].photoUrl,
          name: parsedPlaces[0].name,
          rating: parsedPlaces[0].rating,
          location: parsedPlaces[0].address,
          reviews: parsedPlaces[0].userRatings
        },
      ]);

      setRestaurants([
        {
          id: "2",
          image: parsedPlaces[1].photoUrl,
          name: parsedPlaces[1].name,
          rating: parsedPlaces[1].rating,
          location: parsedPlaces[1].address,
          reviews: parsedPlaces[1].userRatings
        },
      ]);

      setEntertainment([
        {
          id: "3",
          image: parsedPlaces[2].photoUrl,
          name: parsedPlaces[2].name,
          rating: parsedPlaces[2].rating,
          location: parsedPlaces[2].address,
          reviews: parsedPlaces[2].userRatings
        },
      ]);
  }

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchUser = () => {
    setUser(auth.getProfile());
    console.log('UserData: ' + JSON.stringify(auth.getProfile()));
  };

  const handleSearch = async () => {
    clearStore();
    setHotels([]);
    setRestaurants([]);
    setEntertainment([]);

    if (!destination || !date) {
      alert("Please enter both location and date.");
      return;
    }

    try {
      const location = await getCoordinates(destination);
      const weather = await getWeather(location.lat, location.lon, date);
      const places = await getPlaces(location.lat, location.lon);

      const parsedPlaces = await parsePlacesResponse(places);

      if (!parsedPlaces) {
        setSearchError("Error fetching places data. Try again.");
        return;
      }

      populatePlaces(parsedPlaces);

      if (!parsedPlaces) {
        setSearchError("Error fetching places data. Try again.");
        return;
      }

      setWeatherResults({
        weatherResponse: weather        
      });
      setSearchError("");

      store(destination, new Date(date), JSON.stringify(weather), JSON.stringify(parsedPlaces));
    } catch (error) {
      console.error("Error fetching data:", error);
      setSearchError("Error fetching data. Try again.");
    }
  };

  const ratingString = (rating: number) => {
    let ratingString = "";
    const flatRating = Math.floor(rating);
    
    for (let i = 0; i < flatRating; i++) {
      ratingString += "⭐";
    }    

    return ratingString;
  }

  const saveItinerary = async () => {
    try {
      if (!user.id) {
        console.error("User ID is null or undefined. Cannot save itinerary.");
        return;
      }
  
      const itineraryDate = new Date(date);
  
      const response = await saveFavorite(
        {
          destination: destination,
          date: itineraryDate,
          weatherResponse: "weatherResponse",
          placesResponse: "placesResponse",
        }        
      );
  
      console.log(response);
      console.log("Saving itinerary...");
  
      setItinerarySaved(true);
  
      // Hide the saved message after 3 seconds
      setTimeout(() => {
        setItinerarySaved(true); 
      }, 300);
  
      console.log("Itinerary saved!");
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
      {searchError && <p className="text-red-500 mt-2">{searchError}</p>}

      {weatherResults && (
        <div> 
        <div className="mt-4 p-4 border rounded bg-gray-100">
           
           
          
          <WeatherDisplay weather={weatherResults.weatherResponse} />
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
                        <p className="card-rating">{ratingString(hotel.rating)} {hotel.reviews} reviews</p>
                    </div>
                ))}
              </div>

              <div className="results-box">
                {restaurants.map((restaurant) => (
                    <div className="result-card" key={restaurant.id}>
                        <img src={restaurant.image} alt={restaurant.name} />
                        <p><strong>{restaurant.name}</strong></p>
                        <p>{restaurant.location}</p>
                        <p className="card-rating">{ratingString(restaurant.rating)} {restaurant.reviews} reviews</p>
                    </div>
                ))}
              </div>

              <div className="results-box">
                {entertainment.map((ent) => (
                  <div className="result-card" key={ent.id}>
                    <img src={ent.image} alt={ent.name} />
                    <p><strong>{ent.name}</strong></p>
                    <p>{ent.location}</p>
                    <p className="card-rating">{ratingString(ent.rating)} {ent.reviews} reviews</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

      
            <div className="save-itinerary">
            {
          loginCheck ? (
            <button
              className="btn"
              type="button"
              onClick={() => {
                saveItinerary(); // Call your save function here
                setItinerarySaved(true); // Update state to display the success message
              }}
            >
                  Save Itinerary
                </button>) :
            <Link to="/login"><p className="login-link">Login to save this result!</p></Link>
        }

            {itinerarySaved && (
              <p className="save-message">Your itinerary has been saved!</p>
            )}
            </div>
      
        </div>
    )}


    </div>
  );
};

export default Home;
