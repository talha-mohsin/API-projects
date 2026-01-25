let cityInput = document.querySelector('.cityInput');
let searchBtn = document.querySelector('.searchBtn');

let weatherInfoSection = document.querySelector('.weatherInfo');
let notFoundSection = document.querySelector('.notFound');

let loader = document.querySelector('.loader');
let allSections = document.querySelectorAll('section');

let countryTxt = document.querySelector('.countryTxt');
let tempTxt = document.querySelector('.tempTxt');
let conditionTxt = document.querySelector('.conditionTxt');
let humidityValueTxt = document.querySelector('.humidityValueTxt');
let windValueTxt = document.querySelector('.windValueTxt');
let weatherSummaryImg = document.querySelector('.weatherSummaryImg');
let currentDateTxt = document.querySelector('.currentDateTxt');

let forecastItemsContaier = document.querySelector('.forecastItemsContaier');

let apiKey = `a9452db308801f0d568d351ce32b1f17`;

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != "") { 
        allSections.forEach(sec => sec.style.display = 'none');
        loader.style.display = 'flex';
        updateWeatherInfo(cityInput.value);
        cityInput.value = ""
        cityInput.blur();
    }
}) 

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        allSections.forEach(sec => sec.style.display = 'none');
        loader.style.display = 'flex';
        updateWeatherInfo(cityInput.value);
    }
})

navigator.geolocation.getCurrentPosition(position => {
    const {coords: {latitude, longitude}} = position
    updateWeatherInfo([latitude, longitude])
});

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    loader.style.display = 'none';

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    // DESTRUCTURIZATION
    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed},
    } = weatherData;

    countryTxt.textContent = typeof(city) === 'object' ? '' : country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';

    currentDateTxt.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection);
}

// FETCHING DATA 
async function getFetchData(endPoint, city) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?${typeof(city) === 'object' ? `lat=${city[0]}&lon=${city[1]}` : `q=${city}`}&appid=${apiKey}&units=metric`

    let res = await fetch(apiUrl);
    return res.json();
}

function getWeatherIcon(id) {
    if(id <= 232) return `thunderstorm.svg`;
    if(id <= 321) return `drizzle.svg`;
    if(id <= 531) return `rain.svg`;
    if(id <= 622) return `snow.svg`;
    if(id <= 781) return `atmosphere.svg`;
    if(id <= 800) return `clear.svg`;
    else return 'clouds.svg';
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-US', options);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];

    forecastItemsContaier.innerHTML = '';

    forecastsData.list.forEach((forecastWeather) => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    })
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: {temp}
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
    
    const foreCastItem = `
        <div class="forecastItem">
            <h5 class="forecastItemDate regularTxt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecastItemImg">
            <h5 class="forecastItemTemp">${Math.round(temp)} °C</h5>
        </div>
    `;
    forecastItemsContaier.insertAdjacentHTML('beforeend', foreCastItem)

}

function showDisplaySection(section) {
    [weatherInfoSection, notFoundSection].forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}
