// DOM Elements
const inputArea = document.querySelector(".input-area");
const searchButton = document.querySelector("#btn");
const errorSection = document.querySelector(".not-found-area");
const searchCitySection = document.querySelector(".search-city");
const weatherDataSection = document.querySelector(".entire-weather-data-area");
const cityNameElement = document.querySelector(".city");
const day = document.querySelector(".day");
const weatherImage = document.querySelector(".weather-image");
const temperature = document.querySelector(".tempreture");
const situation = document.querySelector(".situation");
const humidityValue = document.querySelector(".humidity-percentage");
const windSpeed = document.querySelector(".wind-measure");
const forecastContainer = document.querySelector(".upcoming-days");

// Display Error
function showErrorDisplay() {
  searchCitySection.style.display = "none";
  weatherDataSection.style.display = "none";
  errorSection.style.display = "flex";
}

// Get Current Date
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

// Update Forecast Info
async function updateForecastInfo(cityName) {
  try {
    const forecastData = await getWeatherData("forecast", cityName);
    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];
    
    forecastContainer.innerHTML = "";

    forecastData.list.forEach((forecastWeather) => {
      if (
        forecastWeather.dt_txt.includes(timeTaken) &&
        !forecastWeather.dt_txt.includes(todayDate)
      ) {
        console.log(forecastWeather);
        updateForcastItems(forecastWeather);
      }
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Update Forecast Items
function updateForcastItems(forecastWeather) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = forecastWeather;

  function getImage(id) {
    switch (true) {
      case id >= 200 && id <= 232:
        return "thunderstorm.svg";
      case id >= 300 && id <= 321:
        return "drizzle.svg";
      case id >= 500 && id <= 531:
        return "rain.svg";
      case id >= 600 && id <= 622:
        return "snow.svg";
      case id >= 701 && id <= 781:
        return "atmosphere.svg";
      case id === 800:
        return "clear.svg";
      case id >= 801 && id <= 804:
        return "clouds.svg";
      default:
        console.log("Unknown weather ID:", id);
        return "default.svg";
    }
  }

  // Format the date
  const forecastDate = new Date(date);
  const dateOptions = {
    day: "2-digit",
    month: "short",
  };
  const formattedDate = forecastDate.toLocaleDateString("en-GB", dateOptions);

  const forecastItem = `
    <div class="upcoming-days-box">
      <p class="box-date">${formattedDate}</p>
      <img src="assets/weather/${getImage(id)}" alt="weather image">
      <p class="box-tempreture">${Math.round(temp)} °C</p>
    </div>
  `;

  forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
}

// Show Weather Data
async function showWeatherData(weatherData) {
  console.log("Weather Data:", weatherData);

  if (
    !weatherData ||
    !weatherData.main ||
    !weatherData.weather ||
    !weatherData.wind
  ) {
    showErrorDisplay();
    return;
  }

  searchCitySection.style.display = "none";
  errorSection.style.display = "none";
  weatherDataSection.style.display = "flex";

  const {
    name: city,
    main: { humidity, temp },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  cityNameElement.innerText = city;
  temperature.innerText = `${Math.round(temp)} °C `;
  situation.innerText = main;
  humidityValue.innerText = `${humidity}%`;
  windSpeed.innerText = `${speed} m/s`;
  day.innerText = getCurrentDate();

  switch (true) {
    case id >= 200 && id <= 232:
      weatherImage.src = "assets/weather/thunderstorm.svg";
      break;
    case id >= 300 && id <= 321:
      weatherImage.src = "assets/weather/drizzle.svg";
      break;
    case id >= 500 && id <= 531:
      weatherImage.src = "assets/weather/rain.svg";
      break;
    case id >= 600 && id <= 622:
      weatherImage.src = "assets/weather/snow.svg";
      break;
    case id >= 701 && id <= 781:
      weatherImage.src = "assets/weather/atmosphere.svg";
      break;
    case id === 800:
      weatherImage.src = "assets/weather/clear.svg";
      break;
    case id >= 801 && id <= 804:
      weatherImage.src = "assets/weather/clouds.svg";
      break;
    default:
      console.log("Unknown weather ID:", id);
      weatherImage.src = "assets/weather/default.svg";
      break;
  }

  await updateForecastInfo(weatherData.name);
}

// Get Weather Data
async function getWeatherData(endPoint, cityName) {
  const apiKey = "0d9f06cab83f78dca31c02389f78fdc4";
  const api = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${cityName}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(api);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const weatherData = await response.json();
    console.log("API Response:", weatherData);
    
    if (weatherData.cod === "404") {
      showErrorDisplay();
      return;
    } else {
      return weatherData;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    showErrorDisplay();
  }
}

// Event Listeners
searchButton.addEventListener("click", () => {
  if (inputArea.value.trim() !== "") {
    const cityName = inputArea.value;
    getWeatherData("weather", cityName).then((weatherData) => {
      if (weatherData) {
        showWeatherData(weatherData);
      }
    });
    inputArea.value = "";
    inputArea.blur();
  }
});

inputArea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputArea.value.trim() !== "") {
    const cityName = inputArea.value;
    getWeatherData("weather", cityName).then((weatherData) => {
      if (weatherData) {
        showWeatherData(weatherData);
      }
    });
    inputArea.value = "";
    inputArea.blur();
  }
});

