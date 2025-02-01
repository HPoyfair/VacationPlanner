import { useState, useEffect, useLayoutEffect } from "react";
import { retrieveUsers } from "../api/userAPI";
import type { UserData } from "../interfaces/UserData";
import ErrorPage from "./ErrorPage";
import UserList from '../components/Users';
import auth from '../utils/auth';
import axios from "axios"; // Ensure axios is imported for the search API call

const Home = () => {

    const [users, setUsers] = useState<UserData[]>([]);
    const [error, setError] = useState(false);
    const [loginCheck, setLoginCheck] = useState(false);

    // States for search bar
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        if (loginCheck) {
            fetchUsers();
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

    const fetchUsers = async () => {
        try {
            const data = await retrieveUsers();
            setUsers(data)
        } catch (err) {
            console.error('Failed to retrieve tickets:', err);
            setError(true);
        }
    };

    // Search handler
    const handleSearch = async () => {
        if (!location || !date) {
            alert("Please enter both location and date.");
            return;
        }

        try {
            // TODO: Make an API call to the server
            const response = await axios.get("http://localhost:3000/api/", {
                params: { location, date }
            });
            setSearchResults(response.data); // Store the search results
            setSearchError(""); // Clear any previous search errors
        } catch (error) {
            console.error(error);
            setSearchError("Error fetching data. Try again.");
        }
    };

    if (error) {
        return <ErrorPage />;
    }

    return (
        <>
            {/* Search Bar Section */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter destination"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    // className="border p-2 mr-2 rounded"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    // className="border p-2 mr-2 rounded"
                />
                <button
                    onClick={handleSearch}
                    // className="bg-blue-500 text-white p-2 rounded"
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
                    <pre>{JSON.stringify(searchResults, null, 2)}</pre>
                </div>
            )}

            {/* User List Section */}
            {
                !loginCheck ? (
                    <div className='login-notice'>
                        {/* <p>
                            Login to save your favorite destinations!
                        </p> */}
                    </div>
                ) : (
                    <UserList users={users} />
                )}
        </>
    );
};

export default Home;
