const search = document.getElementById('searchCity')
const cityInput = document.getElementById('inputCity')
const weatherInfo = document.getElementById('weather-info')
const tempDiv = document.getElementById('temp-div')
const weatherIcon = document.getElementById('weather-icon')
const cityInfo = document.getElementById('city-info')
const forecastInfo = document.getElementById('forecast-info')
const apiKey = 'a0e37c681e24ca5933465d702086f6e3'
const degreeSymbol = '\u00B0'

async function getWeather(city){  

    const weatherDataUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    const weatherResponse = await fetch(weatherDataUrl)

    if (!weatherResponse.ok){
        throw new Error(alert("Could not fetch weather data"))
    }

    return await weatherResponse.json()
}

async function getForecast(city){

    const forecastDataUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    const forecastResponse = await fetch(forecastDataUrl)

    if (!forecastResponse.ok){
        throw new Error(alert("Could not fetch weather data"))
    }

    return await forecastResponse.json()
}

function displayWeatherInfo(data){

    const {name: city, 
        main: {temp}, 
        weather: [{description, icon}]} = data

    cityInfo.textContent = city
    weatherInfo.textContent = description

    tempDiv.textContent = `${(temp - 273.15).toFixed(1)}${degreeSymbol}C` 
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`
    weatherIcon.alt = description
    weatherIcon.style.display = 'block'
    cityInput.value = ""
}

function displayForecastInfo(data){

    const oneDayData = data.slice(0,8) //display 24hrs data with 3hrs interval

    oneDayData.forEach(item =>{
        const dateTime = new Date(item.dt *1000)
        const hour = dateTime.getHours()
        const temp = `${(item.main.temp - 273.15).toFixed(1)}${degreeSymbol}C` 
        const iconCode = item.weather[0].icon
        const forecastIcon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        const forecastDisplay = `
            <div class="forecastItem">
                <span>${hour}:00</span>
                <img src="${forecastIcon}" alt="forecastIcon">
                <span>${temp}</span>
            </div>
        `

        forecastInfo.innerHTML += forecastDisplay
    })
    
    
}

search.addEventListener('click', async event => {
    event.preventDefault()

    const city = cityInput.value
  
    if (!city){
        alert('Please enter a city')
        return
    } else{
        try{
            const weatherData = await getWeather(city);
            const forecastData = await getForecast(city);
            displayWeatherInfo(weatherData)
            displayForecastInfo(forecastData.list)
        }
        catch(error){
            console.error(error)
        }
    }

   

})