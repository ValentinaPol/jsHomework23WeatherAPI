//https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=4f82ea256c9b3cdbfa9b7d9d5ae06516

const WEATHER_DATA = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = 'b8d5bf556203687ef61b61d3b504fce0';

const getResourse = async(url) => {
    try{
        const res = await fetch(url);
        return res.json();
    } catch (err){
        throw new Error(`Error code ${err.status}`)
    }
}

const getWeatherInfo = async (place) => {
    const result = await getResourse(`${WEATHER_DATA}?q=${place}&appid=${APP_ID}`);
    return result;
}


const currentWeatherPicture = (temp) => {
    let currentPicture = document.querySelector('#weather-current');
    if(temp > 20){
        currentPicture.setAttribute('src', 'images/tropical.jpg');
    } else if(temp > 0 && temp < 20){
        currentPicture.setAttribute('src', 'images/fall.jpg');
    } else{
        currentPicture.setAttribute('src', 'images/winter.jpg');
    }
}

const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours == 0) {
        hours = '00'
    } else {
        hours %= 12;
        hours = hours || 12;  
    }
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

const renderWeatherApp = async () => {
    const currentPlace = document.querySelector('#place').value.trim();
    const data = await getWeatherInfo(currentPlace);
    console.log(data);
    const WEATHER_FIVE_DAYS = `http://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${APP_ID}`;
    //console.log(getResourse(WEATHER_FIVE_DAYS));
    const dataFiveDays = await getResourse(WEATHER_FIVE_DAYS);
    console.log(dataFiveDays);
    const currentTemp = document.querySelector('#current-temp');
    const currentWind = document.querySelector('#current-wind');
    currentTemp.innerHTML = Math.round(data.main.temp - 273);
    currentWind.innerHTML = Math.ceil(data.wind.speed);
    currentWeatherPicture(Math.round(data.main.temp - 273));
    const currentWeatherNexFiveDays = document.querySelector('.with-header');
    currentWeatherNexFiveDays.innerHTML = '<li class="collection-header"><h4>5 Day / 3 Hour Forecast</h4></li>';
    dataFiveDays.list.forEach((tempItem) =>{
        currentWeatherNexFiveDays.innerHTML += `
        <li class="collection-item"><div>${formatTime(new Date(tempItem.dt*1000))}<a href="#!" class="secondary-content"><i class="material-icons">${Math.round(tempItem.main.temp - 273)} degrees</i></a></div></li>
        `
    })
    
}

document.querySelector('#get-info').addEventListener('click', renderWeatherApp);

