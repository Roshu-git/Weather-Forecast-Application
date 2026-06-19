// My api-ky for this project
const apiKey = "1112ff37e6bd431899684945261506";

// Sidebar button working js
const weatherbtn = document.getElementById("weather");
const citybtn = document.getElementById("city");
const weathersec = document.querySelector(".wf-weathersec");
const citysec = document.querySelector(".wf-city-sec");

weatherbtn.addEventListener("click", function(e){
    e.preventDefault();
    weathersec.style.display = "block";
    citysec.style.display = "none";

    weatherbtn.classList.add("active");
    citybtn.classList.remove("active");
})

citybtn.addEventListener("click", function(e){
    e.preventDefault();
    citysec.style.display = "block";
    weathersec.style.display="none";

    citybtn.classList.add("active");
    weatherbtn.classList.remove("active");
})

// on window load show current location
window.addEventListener("load", getCurrentlocation);
function getCurrentlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            success,
            error
        );
    } else{
        getWeather("Indore");
    }
} 
function success(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getWeather(`${lat},${lon}`);
}
function error(){
    getWeather("Indore");
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
        console.log("show fareenite");

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

// document.getElementById("celciusbtn").addEventListener("click", function(){
//     currentUnit ="C"
//     displayWeather(weatherData);
// })
// document.getElementById("fahrenheitbtn").addEventListener("click", function(){
//     currentUnit ="F"
//     displayWeather(weatherData);
// })
// function when any query occurs 
async function getWeather(query){

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
        console.log("day is-", day)
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
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/temprature.png" alt="icon">
                    <span>Real Feel</span>
                </div>
                <h3>${feelsLike} ${unit}</h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/wind.png" alt="icon">
                    <span>Wind</span>
                </div>
                <h3>${data.current.wind_kph} km/h </h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/clouds.png" alt="icon">
                    <span>Clouds</span>
                </div>
                <h3>${data.current.cloud} % </h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/humidity.png" alt="icon">
                    <span>Humidity</span>
                </div>
                <h3>${data.current.humidity} %</h3>
            </div>
        </div>
        `
        console.log("wea-", data.current.feelslike_c)
        const conditiontext = data.current.condition.text.toLowerCase();
        console.log(conditiontext);
        const weathercard = document.querySelector(".wf-bgimg");
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
    
        // console.log(conditiontext == "partly cloudy");
        // if(conditiontext == "partly cloudy"){
        //     console.log("partly cloudy called.");
        //     document.querySelector(".ef-bgimg").style.backgroundImage ="url('../assets/images/partly-cloudy.png')";
        // }

       
    }
    catch(error){
        console.log(error);
    }
}
// when user click on search button, apply event on search button
document.getElementById("searchbtn").addEventListener("click", getCurrentweather);

// If not write in the search city fiels then 
async function getCurrentweather(){
    const city = document.getElementById("searchcity").value.trim();
    if(!city){
        document.querySelector(".error").textContent= "Please enter city name."
        return;
    }
    document.querySelector(".error").textContent=" ";
    getWeather(city);
}

function displayWeather(data){
    const temp = currentUnit === "C" ? data.current.temp_c : data.current.temp_f ;
    const unit = currentUnit === "C" ? "°C" : "°F";
    const feelsLike = currentUnit === "C" ? data.current.feelslike_c : data.current.feelslike_f;

     const date = new Date(data.location.localtime);
        const day = date.toLocaleDateString("en-US",{weekday: "long"});
        console.log("day is-", day)
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
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/temprature.png" alt="icon">
                    <span>Real Feel</span>
                </div>
                <h3>${feelsLike} ${unit}</h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/wind.png" alt="icon">
                    <span>Wind</span>
                </div>
                <h3>${data.current.wind_kph} km/h </h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/clouds.png" alt="icon">
                    <span>Clouds</span>
                </div>
                <h3>${data.current.cloud} % </h3>
            </div>
            <div class="wf-conditionbox">
                <div class="wf-conheading flex gap-2 align-center">
                    <img src="./assets/images/humidity.png" alt="icon">
                    <span>Humidity</span>
                </div>
                <h3>${data.current.humidity} %</h3>
            </div>
        </div>
        `;
console.log("weaf-", data.current.feelslike_f);
        const conditiontext = data.current.condition.text.toLowerCase();
        console.log(conditiontext);
        const weathercard = document.querySelector(".wf-bgimg");
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

// 


