
interface SearchBarProps {
    destination: string;
    setDestination: (destination: string) => void;
    date: string;
    setDate: (date: string) => void;
    handleSearch: () => void;
}

const SearchBar = ({destination, setDestination, date, setDate, handleSearch}: SearchBarProps) => {
    return (
        <div className="search-bar">
        <input
            type="text"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
        />
        <