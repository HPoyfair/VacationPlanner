const store = (search: string, date: Date, weather: string, places: string) => {
    localStorage.setItem("search", search);
    localStorage.setItem("date", date.toISOString());
    localStorage.setItem("weather", weather);
    localStorage.setItem("places", places);
    // Store for 10 minutes
    localStorage.setItem("expires", (new Date(date).getTime() + 600000).toString());
}

const getStored = () => {
    const expires = localStorage.getItem("expires");

    if (expires && new Date().getTime() <= Number(expires)) {
        return {
            search: localStorage.getItem("search"),
            date: new Date(localStorage.getItem("date") || ""),
            weather: localStorage.getItem("weather"),
            places: localStorage.getItem("places")
        }
    } else {
        clearStore();
        return null;
    }
}

const clearStore = () => {
    localStorage.removeItem("search");
    localStorage.removeItem("date");
    localStorage.removeItem("weather");
    localStorage.removeItem("places");
    localStorage.removeItem("expires");
}

export { store, getStored, clearStore }