import WeatherResponse from "../interfaces/WeatherResponse";
import '../components/weather.css';

interface WeatherProps {
    weather: WeatherResponse;
}

const WeatherDisplay = ({ weather }:WeatherProps) => {
    // TODO: Reimplement once timezone-adjusted date is available
    // const formatDate = (dateString: string): string => {
    //     const date = new Date(dateString);
    //     return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    // };
    const convertAngleToDirection = (angle: number):string => {
        // Convert the angle to a compass direction
        if (angle >= 348.75 || angle < 11.25) {
            return 'N';
        } else if (angle < 33.75) {
            return 'NNE';
        } else if (angle < 56.25) {
            return 'NE';
        } else if (angle < 78.75) {
            return 'ENE';
        } else if (angle < 101.25) {
            return 'E';
        } else if (angle < 123.75) {
            return 'ESE';
        } else if (angle < 146.25) {
            return 'SE';
        } else if (angle < 168.75) {
            return 'SSE';
        } else if (angle < 191.25) {
            return 'S';
        } else if (angle < 213.75) {
            return 'SSW';
        } else if (angle < 236.25) {
            return 'SW';
        } else if (angle < 258.75) {
            return 'WSW';
        } else if (angle < 281.25) {
            return 'W';
        } else if (angle < 303.75) {
            return 'WNW';
        } else if (angle < 326.25) {
            return 'NW';
        } else {
            return 'NNW';
        }
    }

    const convertCloudCoverToString = (cloudCover: number):string => {
        // Return a description of the cloud cover based on a percentage
        if (cloudCover < 20) {
            return 'Clear';
        } else if (cloudCover < 50) {
            return 'Partly Cloudy';
        } else if (cloudCover < 80) {
            return 'Mostly Cloudy';
        } else {
            return 'Overcast';
        }
    }

    return (
        <div className="weatherCard">
            <h2>Weather Forecast</h2>
            <p>Temperature: {Math.floor(weather.temperature.min)} - {Math.floor(weather.temperature.max)}°F</p>
            <p>Wind: {convertAngleToDirection(weather.wind.max.direction)} at {Math.floor(weather.wind.max.speed)} MPH</p>
            <p>Cloud Cover: {convertCloudCoverToString(weather.cloud_cover.afternoon)}</p>
            <p>Humidity: {Math.floor(weather.humidity.afternoon)}%</p>
        </div>
    )
}

export default WeatherDisplay;