const baseURL = 'https://api.openweathermap.org';
const apiKey = 'dc2556c07508f18009a5420cc2296743';

const choicesEl = document.getElementById('choices');
const searchCityChoicesEl = document.getElementById('searchChoices');

const dashboardContainerEl = document.getElementById('dashboardContainer');
const dashboardEl = document.getElementById('dashboard');
const dailyForecastContainerEl = document.getElementById('dailyForecastContainer');
const dailyForecastEl = document.getElementById('dailyForecast');

const listOfCities = [];

//geo location
//https://api.openweathermap.org/geo/1.0/direct?q=Cleveland&limit=5&appid=dc2556c07508f18009a5420cc2296743

//forecast api
//https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=dc2556c07508f18009a5420cc2296743&units=imperial

let searchBtn = document.getElementById('btnSearch');

searchBtn.addEventListener('click', searchCity);

function searchCity() {
  // alert("you click the search btn");
  let txtInput = 'Cleveland'; //document.getElementById("txtInput").value;

  searchCityChoicesEl.textContent = ''; //clear old stuff out
  fetch(`${baseURL}/geo/1.0/direct?q=${txtInput}&limit=5&appid=${apiKey}`)
    .then((res) => {
      if (res.ok) {
        choicesEl.removeAttribute('class');
        res.json().then((data) => {
          console.log(data);
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              listOfCities.push(data[i]);
              let city = document.createElement('p');
              let cityObject = data[i];
              city.textContent = `${data[i].name}, ${data[i].state}`;

              city.addEventListener('click', function () {
                selectCity(cityObject);
              });
              searchCityChoicesEl.appendChild(city);
            }
          }
        });
      } else {
        console.log('NOT SUCCESS');
      }
    })
    .catch((error) => console.log(error));
}

function selectCity(cityObject) {
  dashboardContainerEl.removeAttribute('class');
  dashboardEl.textContent = ''; //Clear out the old content

  fetch(`${baseURL}/data/2.5/onecall?lat=${cityObject.lat}&lon=${cityObject.lon}&limit=5&appid=${apiKey}&units=imperial`)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          if (Object.keys(data).length > 0) {
            let today = formatUnixTimeStamp(data.current.dt);

            let cityDateDisplayDiv = createDivElement('class', 'cityDateWeather'); //document.createElement('div');

            let weatherIcon = getWeatherIcon(data.current.weather[0].icon);

            let cityDisplay = contentDisplay('', `${cityObject.name}`, '');
            cityDisplay.setAttribute('class', 'bigFont');

            let tempDisplay = contentDisplay('Temp', `${data.current.temp}`, '°F');
            let windDisplay = contentDisplay('Wind', `${data.current.wind_speed}`, 'MPH');
            let humidityDisplay = contentDisplay('Humidity', `${data.current.humidity}`, '%');
            let uvIndexDisplay = contentDisplay('UV Index', `${data.current.uvi}`, '');

            cityDisplay.textContent += ` (${today})`;

            cityDateDisplayDiv.append(cityDisplay, weatherIcon);

            dashboardEl.append(cityDateDisplayDiv, tempDisplay, windDisplay, humidityDisplay, uvIndexDisplay);
            getNextFiveDayForecast(data.daily);
          }
        });
      } else {
        console.log('forecast API not Success');
      }
    })
    .catch((error) => console.log(error));
}

function formatUnixTimeStamp(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleDateString('en-US');
}

function getNextFiveDayForecast(listOfDailyObject) {
  let listOfDailyObj = listOfDailyObject.slice(1, 6); //Get the next friday and exclude today's
  dailyForecastContainerEl.removeAttribute('class');
  dailyForecastEl.textContent = ''; //Clear out the old content

  for (let i = 0; i < listOfDailyObj.length; i++) {
    let individualDayDiv = createDivElement('class', 'forecastDiv');

    let forecastDate = formatUnixTimeStamp(listOfDailyObj[i].dt);

    let weatherIconDisplay = getWeatherIcon(listOfDailyObj[i].weather[0].icon);
    let dateDisplay = contentDisplay('', `${forecastDate}`, '');
    let tempDisplay = contentDisplay('Temp', `${listOfDailyObj[i].temp.day}`, '°F');
    let windDisplay = contentDisplay('Wind', `${listOfDailyObj[i].wind_speed}`, 'MPH');
    let humidityDisplay = contentDisplay('Humidity', `${listOfDailyObj[i].humidity}`, '%');

    individualDayDiv.append(dateDisplay, weatherIconDisplay, tempDisplay, windDisplay, humidityDisplay);

    dailyForecastEl.appendChild(individualDayDiv);
  }
}

function getWeatherIcon(icon) {
  let weatherIcon = document.createElement('img');
  weatherIcon.setAttribute('class', 'weatherIcon');
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`);

  return weatherIcon;
}

function contentDisplay(title, value, suffix) {
  let textDisplay = document.createElement('p');
  textDisplay.setAttribute('class', 'cityTemperature');
  if (title === '') {
    textDisplay.textContent = `${value}`;
  } else {
    textDisplay.textContent = `${title}: ${value} ${suffix}`;
  }

  return textDisplay;
}

function createDivElement(name, style) {
  let createDiv = document.createElement('div');
  createDiv.setAttribute(name, style);

  return createDiv;
}
