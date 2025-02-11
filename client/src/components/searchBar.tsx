
interface SearchBarProps {
    destination: string;
    setDestination: (destination: string) => void;
    date: string;
    setDate: (date: string) => void;
    handleSearch: () => void;
}

const SearchBar = ({destination, setDestination, date, setDate, handleSearch}: SearchBarProps) => {
    return (
        <form>
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
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    Search
                </button>
            </div> 
        </form>
    )
}

export default SearchBar;