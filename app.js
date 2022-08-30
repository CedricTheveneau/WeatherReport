// Splashscreen //
const splash = document.querySelector(".splash");

document.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    splash.classList.add("display-none");
  }, 2000);
});

// WeatherApp //
// Get all necessary elements from the DOM //
const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

// Default city when the page loads //
let cityInput = "London";

// Add click event to each city in the panel //
cities.forEach((city) => {
  city.addEventListener("click", (e) => {
    // Change from default city to the clicked one //
    cityInput = e.target.innerHTML;
    /* Function that fetches and displays all the data from the weather API */
    fetchWeatherData();
    // Fade out the app (animation) //
    app.style.opacity = "0";
  });
});

// Add submit event to the form //
form.addEventListener("submit", (e) => {
  /* If the search bar is empty, throw an alert */
  if (search.value.length == 0) {
    alert("Please, type in a city name");
  } else {
    /* Change from the default city to the one written in the input field */
    cityInput = search.value;
    /* Function that fetches and displays all the data from the weather API */
    fetchWeatherData();
    /* Remove all text from the input field */
    search.value = "";
    // Fade out the app (animation) //
    app.style.opacity = "0";
  }

  // Prevents the default behavior of the form //
  e.preventDefault();
});

/* Function that returns a day of the week from a date */
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date("${day}/${month}/${year}").getDay()];
}

/* Function that fetches and displays the data from the Weather API */
function fetchWeatherData() {
  /* Fetches the data and dinamically add the city name with template literals */
  /* Use your own key */
  fetch(
    "https://api.weatherapi.com/v1/current.json?key=dca0f3ef8101433aa55163153223008&q=${cityInput}&aqi=no"
  )
    /* Take the data and convert it to a regular JS object */
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      /* Temp & weather condition */
      temp.innerHTML = data.current.temp_c + "&#176;";
      conditionOutput.innerHTML = data.current.condition.text;
      /* Get the date and time from the city and exctract day, month, year and time into individual variables */
      const date = data.location.localtime;
      const y = parseInt(date.substr(0, 4));
      const m = parseInt(date.substr(5, 2));
      const d = parseInt(date.substr(8, 2));
      const time = date.substr(11);
      /* Reformat the date into something more appealing */
      dateOutput.innerHTML = "${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}";
      timeOutput.innerHTML = time;
      /* Add the name of the city */
      nameOutput.innerHTML = data.location.name;
      /* Get the corresponding icon url for the weather and extract a part of it */
      const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/".length
      );
      /* Reformat the icon url to your ownlocal folder path */
      icon.src = "./public/icons/" + iconId;
      // Add the weather details to the page //
      cloudOutput.innerHTML = data.current.cloud + "%";
      humidityOutput.innerHTML = data.current.humidity + "%";
      windOutput.innerHTML = data.current.wind_kph + "km/h";
      /* Set default time of the day */
      let timeOfDay = "day";
      /* Get the unique id for each weather condition */
      const code = data.current.condition.code;
      /* Change to night if it's night time in the city */
      if (!data.current.is_day) {
        timeOfDay = "night";
      }
      if (code == 1000) {
        /* Set the bg image to clear if the weather is clear */
        app.style.backgroundImage = "url(./public/img/${timeOfDay}/clear.jpg)";
        /* Change btn color depending on the bg img */
        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
      } else if (
        /* Same thing for cloudy weather */
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
      ) {
        app.style.backgroundImage = "url(./public/img/${timeOfDay}/cloudy.jpg)";
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
          btn.style.background = "#181e27";
        }
        /* And rain */
      } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
      ) {
        app.style.backgroundImage = "url(./public/img/${timeOfDay}/rainy.jpg)";
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
          btn.style.background = "#325c80";
        }
        /* And Snow */
      } else {
        app.style.backgroundImage = "url(./public/img/${timeOfDay}/snowy.jpg)";
        btn.style.background = "#4d72aa";
        if (timeOfDay == "night") {
          btn.style.background = "1b1b1b";
        }
      }
      /* Fade in the page once it's done */
      app.style.opacity = "1";
    })
    /* If the user enters a city that doesn't exist, throw an alert */
    .catch(() => {
      alert("City not found, please try again");
      app.style.opacity = "1";
    });
}

// Call the function on page load //
fetchWeatherData();

/* Fade in the page */
app.style.opacity = "1";
