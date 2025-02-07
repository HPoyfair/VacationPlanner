interface WeatherData {
    min: number;
    max: number;
    afternoon: number;
    night: number;
    evening: number;
    morning: number;
    total: number;
}

interface WindData {
    speed: number;
    direction: number;
}

interface WindResponse {
    max: WindData;
}

interface WeatherResponse {
    lat: number;
    lon: number;
    tz: string;
    date: string;
    units: string;
    cloud_cover: WeatherData;
    humidity: WeatherData;
    precipitation: WeatherData;
    temperature: WeatherData;
    pressure: WeatherData;
    wind: WindResponse;
}

export default WeatherResponse;