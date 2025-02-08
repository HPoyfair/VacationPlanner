const getPlaces = async (lat:number, lon:number) => {
    // Call the places API with Hotel, Restaurant, and Tourist Attraction types
    const radius = 16100; // 16,100 meters = ~10 miles
    const types = ['lodging', 'restaurant', 'tourist_attraction'];

    try {
        const places = await Promise.all(types.map(async (type) => {
            const response = await fetch(`/api/places?lat=${lat}&lon=${lon}&type=${type}&radius=${radius}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`${errorData.message}`);
            }

            return response.json();
        }));

        return places;
    } catch (err) {
        console.log('Error from getPlaces: ', err);
        return Promise.reject(err);
    }
}

export { getPlaces };