// My api-ky for this project
const apiKey = "1112ff37e6bd431899684945261506";

// on window load show current location
window.addEventListener("load", ()=>{
    getCurrentlocation();
    loadRecentcities();
} 
);

function getCurrentlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            success,
            error
        );
    } else{
        getWeather("Indore");
        fivedayForecast("Indore");
    }
} 
function success(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(`${lat},${lon}`);
    fivedayForecast(`${lat},${lon}`);

}
function error(){
    getWeather("Indore");
    fivedayForecast("Indore");
}

// When user search city and click enter, apply event on the enter button
document.getElementById("searchcity").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        getCurrentweather();
    }
})
// toggle button working celcius and farenheit
const unitToggle=  document.getElementById("unitToggle");
unitToggle.addEventListener("change", ()=>{
    if(unitToggle.checked){
        currentUnit = "F";
        console.log("show farehenite");

    }else{
        currentUnit = "C";
        console.log("show celcius");
    }
    if(weatherData){
        displayWeather(weatherData); 
    }
})

let currentUnit = "C";
let weatherData = null;

// function when any query occurs and fetch weather data
async function getWeather(query){
    const loader = document.getElementById("wf-loader");
    const weather = document.getElementById("wf-curweather");

    loader.classList.remove("hidden");
    weather.innerHTML = "";

    try{
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`);
        const data = await response.json();
        weatherData = data;
        const temp = currentUnit === "C" ? data.current.temp_c : data.current.temp_f;
        const unit = currentUnit === "C" ? "°C" : "°F";
        const feelsLike = currentUnit === "C" ? data.current.feelslike_c : data.current.feelslike_f;
        if(data.error){
            document.getElementById("wf-curweather").innerHTML=`
            <p>${data.error.message} </p>`;
            return;
        }

        const date = new Date(data.location.localtime);
        const day = date.toLocaleDateString("en-US",{weekday: "long"});
        const fullDate = date.toLocaleDateString("en-US", {
            day:"numeric",
            month:"long",
            year:"numeric"
        });
        // HTML design for weather data shown
        document.getElementById("wf-curweather").innerHTML=`
        <div class="wf-bgimg flex align-center justify-between">
        <div class="wf-weatdata">
            <div class="wf-weatlocation flex gap-2">
                <img src="./assets/images/location.png" alt="location-icon" width="30px" height="25px">
                <h3>${data.location.name}</h3>
            </div>
            <p>${day}, ${fullDate}</p>
            <h2>${temp} ${unit}</h2>
        </div>
        <div class="wf-weaimg">
            <img src="${data.current.condition.icon}" alt="icon"/>
        </div>
        </div>
        <h2 class="wf-heading">Air Condition</h2>
        <div class="wf-weathercondition grid grid-cols-4 gap-4">
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/temprature.png" alt="icon">
                    <span>Real Feel</span>
                    <h3>${feelsLike} ${unit}</h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/wind.png" alt="icon">
                    <span>Wind</span>
                    <h3>${data.current.wind_kph} km/h </h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/clouds.png" alt="icon">
                    <span>Clouds</span>
                    <h3>${data.current.cloud} % </h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/humidity.png" alt="icon">
                    <span>Humidity</span>
                    <h3>${data.current.humidity} %</h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/rainy.png" alt="icon">
                    <span>Rain</span>
                    <h3>${data.current.chance_of_rain} % </h3>
                </div>
            </div>  
        </div>
        `
        
        const conditiontext = data.current.condition.text.toLowerCase();
        const weathercard = document.querySelector(".wf-bgimg");

        // Add and remove class according to weather condition and change background image
        weathercard.classList.remove("sunny", "cloudy", "partly-cloudy" , "rainy", "snowy", "mist","fog","freezing-fog");
        if(conditiontext.includes("cloud") || conditiontext.includes("partly-cloudy") ){
            weathercard.classList.add("cloudy");
        } else if(conditiontext.includes("rain")){
            weathercard.classList.add("rainy");
        }else if(conditiontext.includes("mist") || conditiontext.includes("fog")){
            weathercard.classList.add("mist");
        }else if(conditiontext.includes("snow")){
            weathercard.classList.add("snowy");
        }else{
            weathercard.classList.add("sunny");
        }
    
        // Show weather alert box when temprature is greater than 40°C
        const alertbox = document.getElementById("wf-weatheralert");
        const closebtn = document.getElementById("wf-closealert");
        if(data.current.temp_c > 40){
            alertbox.classList.remove("hidden");
            alertbox.style.display="block"
        } else{
            alertbox.classList.add("hidden");
        }
        closebtn.addEventListener("click", ()=>{
            alertbox.classList.add("hidden");
        })
       
    }
    // loader.classList.add("hidden");
    catch(error){
        console.log("Unable to fetch weather , please try again");
        loader.classList.add("hidden");
    }finally {
        loader.classList.add("hidden");
    }

}
// when user click on search button, apply event on search button
document.getElementById("searchbtn").addEventListener("click", getCurrentweather);

// If not write in the search city field then shiw error
async function getCurrentweather(){
    const city = document.getElementById("searchcity").value.trim();
    if(!city){
        document.querySelector(".error").textContent= "Please enter city name."
        return;
    }
    document.querySelector(".error").textContent=" ";
    getWeather(city);
    fivedayForecast(city);
    saveRecentcity(city);
}

// Dusplat weather data such us humidity, wind ,rain etc.
function displayWeather(data){
    const temp = currentUnit === "C" ? data.current.temp_c : data.current.temp_f ;
    const unit = currentUnit === "C" ? "°C" : "°F";
    const feelsLike = currentUnit === "C" ? data.current.feelslike_c : data.current.feelslike_f;

     const date = new Date(data.location.localtime);
        const day = date.toLocaleDateString("en-US",{weekday: "long"});
        const fullDate = date.toLocaleDateString("en-US", {
            day:"numeric",
            month:"long",
            year:"numeric"
        });

    document.getElementById("wf-curweather").innerHTML=`
     <div class="wf-bgimg flex align-center justify-between">
        <div class="wf-weatdata">
            <div class="wf-weatlocation flex gap-2">
                <img src="./assets/images/location.png" alt="location-icon" width="30px" height="25px">
                <h3>${data.location.name}</h3>
            </div>
            <p>${day}, ${fullDate}</p>
            <h2>${temp} ${unit}</h2>
        </div>
        <div class="wf-weaimg">
            <img src="${data.current.condition.icon}" alt="icon"/>
        </div>
        </div>
        <h2 class="wf-heading">Air Condition</h2>
        <div class="wf-weathercondition grid grid-cols-4 gap-4">
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/temprature.png" alt="icon">
                    <span>Real Feel</span>
                    <h3>${feelsLike} ${unit}</h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/wind.png" alt="icon">
                    <span>Wind</span>
                    <h3>${data.current.wind_kph} km/h </h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/clouds.png" alt="icon">
                    <span>Clouds</span>
                    <h3>${data.current.cloud} % </h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/humidity.png" alt="icon">
                    <span>Humidity</span>
                    <h3>${data.current.humidity} %</h3>
                </div>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-3 align-center flex-col">
                    <img src="./assets/images/rainy.png" alt="icon">
                    <span>Rain</span>
                    <h3>${data.current.chance_of_rain} %</h3>
                </div>
            </div>
        </div>
        `;

        const conditiontext = data.current.condition.text.toLowerCase();
        const weathercard = document.querySelector(".wf-bgimg");

        // Add and remove class according to weather condition and change background image 
        weathercard.classList.remove("sunny", "cloudy", "partly-cloudy" , "rainy", "snowy", "mist","fog","freezing-fog");
        if(conditiontext.includes("cloud") || conditiontext.includes("partly-cloudy") ){
            weathercard.classList.add("cloudy");
        } else if(conditiontext.includes("rain")){
            weathercard.classList.add("rainy");
        }else if(conditiontext.includes("mist") || conditiontext.includes("fog")){
            weathercard.classList.add("mist");
        }else if(conditiontext.includes("snow")){
            weathercard.classList.add("snowy");
        }else{
            weathercard.classList.add("sunny");
        }
            
}

// 5-day forecast show
async function fivedayForecast(query){
    try{
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=6`);
        const data = await response.json();

        const temp = currentUnit === "C" ? data.current.temp_c : data.current.temp_f;
        const unit = currentUnit === "C" ? "°C" : "°F";
 
        const forecastContainer = document.getElementById("wf-forecastcontainer");
        forecastContainer.innerHTML = " ";
        data.forecast.forecastday.slice(1).forEach(day=>{
            const dayName = new Date(day.date).toLocaleDateString("en-US",{
                weekday: "long"
            });
            forecastContainer.innerHTML += `
        <div class="wf-forecastcard grid grid-cols-3 gap-4">
            <h4>${dayName}</h4>
            <div class="wf-forcardbox wf-forhumidity flex gap-3 align-center">
                <img src="./assets/images/temprature.png" alt="icon">
                <p>${day.day.avgtemp_c} ${unit}</p>
            </div>
            <div class="wf-forcardbox wf-forwind flex gap-3 align-center">
                <img src="./assets/images/wind.png" alt="icon">
                <p>${day.day.avgtemp_c} ${unit}</p>
            </div>
            <div class="wf-forcardbox wf-condition flex gap-2 items-center">
                <img src="${day.day.condition.icon}" alt="weather">
                <p>${day.day.condition.text}</p>
            </div>
            <div class="wf-forcardbox flex gap-3 align-center">
                <img src="./assets/images/rainy.png" alt="cloud">
                <p>${day.day.daily_chance_of_rain} %</p>
            </div>
            <div class="wf-forcardbox flex gap-3 align-center">
                <img src="./assets/images/humidity.png" alt="humidity">
                <p>${day.day.avghumidity} %</p>
            </div>
           
        </div> 
        `
        })
    }
    catch(error){
        console.log(error);
    }
}

// Ṛecently searched city saved on local storage
function saveRecentcity(city){
    let cities =JSON.parse(localStorage.getItem("wf-recentCities")) || [];

    city = city.trim();
    // Remove duplicate
    cities = cities.filter(c=>c.toLowerCase() !== city.toLowerCase());
    
    // Add latest city at top
    cities.unshift(city);
    if(cities.length > 5){
        cities.pop();
    }
    localStorage.setItem("wf-recentCities",JSON.stringify(cities));
    // localStorage.removeItem("wf-recentCities");
    loadRecentcities();
}
// Dropdown menu for recently searched cities
function loadRecentcities(){
    const dropdown = document.getElementById("wf-recentCities");
    const cities = JSON.parse(localStorage.getItem("wf-recentCities")) || [];
    dropdown.innerHTML =
    `<option value="">Recently searched cities</option>`;
    if(cities.length === 0){
        dropdown.style.display="none";
        return;
    }
    dropdown.style.display = "block";
    cities.forEach(city=>{
        dropdown.innerHTML +=`
        <option value="${city}">${city}</option>`;
    });
}

// click city from dropdown then show data
document.getElementById("wf-recentCities").addEventListener("change", function(){
    const city=this.value;
     if(city){
        document.getElementById("searchcity").value = city;
        getWeather(city);
        fivedayForecast(city);
    }

})

// Ḍisplay recent cities fetch from the local storage.00
// function displayRecentcities(){
//     const recentcontainer = document.getElementById("wf-recentCities");
//     let cities = JSON.parse(localStorage.getItem("wf-recentCities")) || [];
   
//     recentcontainer.innerHTML = "";

//     if(cities.length === 0){
//         recentcontainer.innerHTML = "<p>No Recent Search cities.</p>";
//         return;
//     }
//     cities.forEach(city =>{
//         recentcontainer.innerHTML +=`
//         <div class="wf-citycard" onclick="selectCity('${city}')">
//             ${city}
//         </div>`
//     })
// }