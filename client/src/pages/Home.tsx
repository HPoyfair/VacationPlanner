/* eslint-disable @typescript-eslint/no-unused-vars */
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

const Home = () => {
  const [user, setUser] = useState<UserData>({
    id: 0,
    username: "",
    email: "",
  });

  const [loginCheck, setLoginCheck] = useState(false);

  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [searchError, setSearchError] = useState<string>("");

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

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchUser = () => {
    setUser(auth.getProfile());
  };

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
      const weather = await getWeather(location.lat, location.lon, date);
      const places = await getPlaces(location.lat, location.lon);

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
        },
        user.id
      );

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
      {searchError && <p className="text-red-500 mt-2">{searchError}</p>}

      {searchResults && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-lg font-bold">Search Results:</h2>
          <WeatherDisplay weather={searchResults.weatherResponse} />
        </div>
      )}

      <div className="results-container">
        <div className="results-box">
          <h3>Top Hotels</h3>
          {hotels.map((hotel) => (
            <div className="result-card" key={hotel.id}>
              <img src={hotel.image} alt={hotel.name} />
              <p>
                <strong>{hotel.name}</strong>
              </p>
              <p>{hotel.location}</p>
              <p className="card-price">{hotel.price}</p>
            </div>
          ))}
        </div>

        <div className="results-box">
          <h3>Top Restaurants</h3>
          {restaurants.map((restaurant) => (
            <div className="result-card" key={restaurant.id}>
              <img src={restaurant.image} alt={restaurant.name} />
              <p>
                <strong>{restaurant.name}</strong>
              </p>
              <p>{restaurant.location}</p>
              <p className="card-price">{restaurant.price}</p>
            </div>
          ))}
        </div>

        <div className="results-box">
          <h3>Top Entertainment</h3>
          {entertainment.map((ent) => (
            <div className="result-card" key={ent.id}>
              <img src={ent.image} alt={ent.name} />
              <p>
                <strong>{ent.name}</strong>
              </p>
              <p>{ent.location}</p>
              <p className="card-price">{ent.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="save-itinerary">
        <button className="btn" type="button" onClick={saveItinerary}>
          Save Itinerary
        </button>
      </div>
    </div>
  );
};

export default Home;
