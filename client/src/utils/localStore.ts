const store = (search: string, date: Date, weather: string, places: string) => {
    localStorage.setItem("search", search);
    localStorage.setItem("date", date.toISOString());
    localStorage.setItem("weather", weather);
    localStorage.setItem("places", places);
}

const getStored = () => {
    return {
        search: localStorage.getItem("search"),
        date: new Date(localStorage.getItem("date") || ""),
        weather: localStorage.getItem("weather"),
        places: localStorage.getItem("places")
    }
}

const clearStore = () => {
    localStorage.removeItem("search");
    localStorage.removeItem("date");
    localStorage.removeItem("weather");
    localStorage.removeItem("places");
}

export { store, getStored, clearStore }