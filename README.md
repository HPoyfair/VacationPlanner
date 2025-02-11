# VacationPlanner

A user-friendly web application designed to help you plan your perfect vacation. The application allows users to explore weather conditions and travel options, saving time and effort while planning their trips. With an interactive UI and intuitive features, VacationPlanner makes vacation planning a breeze.

**Live Demo:** [VacationPlanner on Render](https://vacationplanner-v88a.onrender.com/)  
**GitHub Repository:** [GitHub Repo](https://github.com/HPoyfair/VacationPlanner)  

![VacationPlanner Screenshot HomePage](/client/public/HomePage.png)
![VacationPlanner Screenshot SavedDestinationPage](/client/public/SavedDestinationPage.png)


## Features

- **Vacation Search**: Easily search for destinations and get weather forecast for the selected travel date.
- **Weather Data Integration**: Real-time weather information fetched through Open Weather API.
- **Travel Data Integration**: Access travel-related data from Google Places API to assist in determining travel accommodations.
- **JWT Authentication**: Secure login and registration with JWT for user authentication.
- **Responsive Design**: Fully responsive and mobile-friendly user interface.
- **Interactive UI**: Dynamic and easy-to-navigate interface to provide a seamless user experience.
- **Environment Variables**: API keys and sensitive information are stored securely using environment variables.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Sequelize
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Render
- **External APIs**: Open Weather API, Google Places API

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 
- PostgreSQL 
- npm 

### Installation

1. **Clone the repository:**

   git clone https://github.com/HPoyfair/VacationPlanner

2. **Install dependencies:**

For the backend:
cd server
npm install

For the frontend:
cd client
npm install

3. **Setup Environment Variables:**

Create a .env file in the root directory and add the following:
WEATHER_API_KEY=your_weather_api_key
TRAVEL_API_KEY=your_travel_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgresql_database_url


4. **Run the Application Locally:**

npm run start:dev


## Usage
Search for Destinations: Enter a location in the search bar to explore weather and travel information.
Sign Up/Log In: Securely log in or create a new account to save your searches.
View Weather: Get up-to-date weather data for your selected destination on the selected date.
Travel Recommendations: View local travel recommendations for creating your travel itinerary.



## Contributing
We welcome contributions! To get started:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add new feature').
Push to your branch (git push origin feature-branch).
Create a new pull request.


## License
This project is licensed under the MIT License.