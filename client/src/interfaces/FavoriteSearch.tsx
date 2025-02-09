export interface FavoriteSearch {
    
    destination: string,
    date: Date,
    weatherResponse: string,
    placesResponse: string
}

export interface SavedFavoriteSearch {
    id: number,
    destination: string,
    date: Date,
    weatherResponse: string,
    placesResponse: string
}