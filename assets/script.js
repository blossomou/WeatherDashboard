const baseURL = 'https://api.openweathermap.org';
const apiKey = 'dc2556c07508f18009a5420cc2296743';

const choicesEl = document.getElementById('choices');
const searchCityChoicesEl = document.getElementById('searchChoices');
const dashboardEl = document.getElementById('dashboard');
const forecastContainerEl = document.getElementById('forecastContainer');
const fiveDayForecastContainerEl = document.getElementById('fiveDayForecastContainer');

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
  dashboardEl.textContent = ''; //Clear out the old content

  fetch(`${baseURL}/data/2.5/onecall?lat=${cityObject.lat}&lon=${cityObject.lon}&limit=5&appid=${apiKey}&units=imperial`)
    .then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          console.log(data);
          if (Object.keys(data).length > 0) {
            let today = getTodayDate(0);

            let cityDateIconDiv = document.createElement('div');
            cityDateIconDiv.setAttribute('class', 'cityDateWeather');

            let weatherIcon = getWeatherIcon(data.current.weather[0].icon);

            let cityDisplay = contentDisplay('', `${cityObject.name}`, '');
            let tempDisplay = contentDisplay('Temp', `${data.current.temp}`, '°F');
            let windDisplay = contentDisplay('Wind', `${data.current.wind_speed}`, 'MPH');
            let humidityDisplay = contentDisplay('Humidity', `${data.current.humidity}`, '%');
            let uvIndexDisplay = contentDisplay('UV Index', `${data.current.uvi}`, '');

            cityDisplay.setAttribute('class', 'cityTitle');
            cityDisplay.textContent += ` (${today})`;

            cityDateIconDiv.appendChild(cityDisplay);
            cityDateIconDiv.appendChild(weatherIcon);

            dashboardEl.appendChild(cityDateIconDiv);
            dashboardEl.appendChild(tempDisplay);
            dashboardEl.appendChild(windDisplay);
            dashboardEl.appendChild(humidityDisplay);
            dashboardEl.appendChild(uvIndexDisplay);

            getNextFiveDayForecast(data.daily);

            // alert("object is not empty");
          }
        });
      } else {
        console.log('forecast API not Success');
      }
    })
    .catch((error) => console.log(error));
}

function getTodayDate(addNum) {
  var today = new Date();
  var dd = String(today.getDate() + addNum).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function getNextFiveDayForecast(listOfDailyObject) {
  let listOfDailyObj = listOfDailyObject.slice(0, 5);

  fiveDayForecastContainerEl.removeAttribute('class');
  forecastContainerEl.textContent = ''; //Clear out the old content

  for (let i = 0; i < listOfDailyObj.length; i++) {
    let cityDateIconDiv = document.createElement('div');
    cityDateIconDiv.setAttribute('class', 'forecast');

    let forecastDate = getTodayDate(i + 1);

    let weatherIconDisplay = getWeatherIcon(listOfDailyObj[i].weather[0].icon);
    let dateDisplay = contentDisplay('', `${forecastDate}`, '');
    let tempDisplay = contentDisplay('Temp', `${listOfDailyObj[i].temp.day}`, '°F');
    let windDisplay = contentDisplay('Wind', `${listOfDailyObj[i].wind_speed}`, 'MPH');
    let humidityDisplay = contentDisplay('Humidity', `${listOfDailyObj[i].humidity}`, '%');

    cityDateIconDiv.appendChild(dateDisplay);
    cityDateIconDiv.appendChild(weatherIconDisplay);

    cityDateIconDiv.appendChild(tempDisplay);
    cityDateIconDiv.appendChild(windDisplay);
    cityDateIconDiv.appendChild(humidityDisplay);

    forecastContainerEl.appendChild(cityDateIconDiv);
    //console.log(newlistOfDailyObject);
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
