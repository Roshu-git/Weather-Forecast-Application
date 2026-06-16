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

// function when any query occurs 
async function getWeather(query){

    try{
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`);
        const data = await response.json();

        if(data.error){
            document.getElementById("wf-curweather").innerHTML=`
            <p>${data.error.message} </p>`;
            return;
        }

        document.getElementById("wf-curweather").innerHTML=`
        <h2>${data.location.name}</h2>
        <p>Temprature: ${data.current.temp_c} / ${data.current.temp_f}</p>
        <p>Humidity: ${data.current.humidity}</p>
        <p>Wind: ${data.current.wind_kph}</p>
        <img src="${data.current.condition.icon}" />
        `
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


