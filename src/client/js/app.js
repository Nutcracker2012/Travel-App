//Use base URL and Key to queryAPI database based on Web API documntation
//https://openweathermap.org/current
/* Global Variables */

//Get timestamp of now as second 
const timestampNow = (Date.now()) / 1000;
//geonames Search API
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const geoUsername = "nutcracker2012";
//weatherbit API
const weatherbitURL = "https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherbitAPIkey = "10a49528e4074f59b926a3d566b9caeb";

//pixabay API
const pixabayAPIURL = "https://pixabay.com/api/?key=";
const pixabayAPIkey = "16612659-a3ef7a4e4200e1d68ec5b75fb";


// const projectData = {}


//chain the events
document.getElementById('generate').addEventListener('click', performAction);

// Chain events
function performAction(e) {

    //make get request
    getGeoData()
        // New Syntax!
        .then(LocationData => {
            // Add data
            const saveDataForWeather = {}
                // saveDataForWeather.DepartDate = userDepartDate;
            console.log(LocationData);
            const lat = LocationData.geoname[0].lat;
            const lng = LocationData.geoname[0].lng;
            const countryName = LocationData.geoname[0].countryName;
            saveDataForWeather.lat = lat;
            saveDataForWeather.lng = lng;
            saveDataForWeather.countryName = countryName;
            console.log('lat is ', lat, 'lng is ', lng, countryName);
            //Add data to POST request
            //passing in the URL of the POST route, and an object containing the data to be posted.

            console.log(saveDataForWeather)

            postData('http://localhost:3000/add', saveDataForWeather)
        }).then(
            getWeatherForcastData()
        )
        .then(
            getpixbay()
        )
        .then(
            updateUI()
        )
}




// Make a GET request to get GeoData
const getGeoData = async() => {
    //Call the API 
    //The API Key variable is passed as a parameter to 
    const placename = document.getElementById("UserCity").value;
    const api = `${geoNamesURL}${placename}&maxRows=10&username=${geoUsername}`;
    console.log(api)
    const res = await fetch(api)
        // if everything goes well and we get our data back, it will conduct try 
    try {
        // Get new data that is in JSON format using .json method
        const geoData = await res.json();
        // console the data 
        // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
        // 2
        // postData()
        console.log('get GeoData success');
        return geoData;

    } catch (error) {
        // appropriately handle the error
        console.log("error1", error);

    }
}




// Async POST 
// Post Route: take two arguments, the URL to make a POST to, and an object holding the data to POST.
const postData = async(url = '', data = {}) => {

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        // set the application to run json file
        headers: {
            'Content-Type': 'application/json',
        },
        //use JSON.stringify to turn data into json format
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    console.log(url, 'post half check')

    try {
        const UIData = await response.json();
        console.log("add success");
        return UIData
    } catch (error) {
        console.log("error2", error);
    }
}


// Make a GET request to get WeatherForcastData
const getWeatherForcastData = async() => {
    //fetch to get ln & lat
    const res = await fetch('/add');
    const weatherdata = await res.json();
    const lon = weatherdata.lon;
    const lat = weatherdata.lat;

    //Call the API 
    //The API Key variable is passed as a parameter to 
    const userDepartDate = document.getElementById("DepartDate").value;
    const timestampDepart = (new Date(userDepartDate).getTime()) / 1000;
    const dayLeft = Math.round((timestampDepart - timestampNow) / (60 * 60 * 24));
    //Transform depart date in YYYY-MM-DD
    let DepartHisFormat = userDepartDate.getFullYear() + '-' + userDepartDate.getMonth() + 1 + '-' + userDepartDate.getDate();
    let DepartHisFormatTom = userDepartDate.getFullYear() - 1 + '-' + userDepartDate.getMonth() + 1 + '-' + userDepartDate.getDate();
    const weatherbitURL = "https://api.weatherbit.io/v2.0/forecast/daily?";
    const weatherbitAPIkey = "10a49528e4074f59b926a3d566b9caeb";
    //Day left < 16, get weather from forcast
    //https://api.weatherbit.io/v2.0/forecast/daily?lat=51.50853&lon=-0.12574&days=10&key=10a49528e4074f59b926a3d566b9caeb
    const weatherbitApiFuthure = `${weatherbitURL}lat=${lat}&lon=${lon}&days=${dayLeft}&key=${weatherbitAPIkey}`;
    // Day left >16, get weather data from history data
    //https://api.weatherbit.io/v2.0/history/daily?lat=35.775&lon=-78.638&start_date=2020-05-17&end_date=2020-05-18&tz=local&key=10a49528e4074f59b926a3d566b9caeb
    const weatherbitApiHis = `${weatherbitURL}lat=${lat}&lon=${lon}&key=${weatherbitAPIkey}&start_date=${DepartHisFormat}&end_date=${DepartHisFormatTom}`;

    if (dayLeft < 16) {
        const res = await fetch(weatherbitApiFuthure)
            // if everything goes well and we get our data back, it will conduct try 
        try {
            // Get new data that is in JSON format using .json method
            const weatherForcastData = await res.json();
            // console the data 
            // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
            // 2
            const weatherForcastSave = {
                city_name: weatherForcastData.city_name,
                state_code: weatherForcastData.state_code,
                min_temp: weatherForcastData.min_temp,
                max_temp: weatherForcastData.max_temp,
                sunrise: weatherForcastData.sunrise,
                sunset: weatherForcastData.sunset,
                description: weatherForcastData.weather.description,
                dayLeft: dayLeft
                lat: weatherdata.lat
                lon: weatherdata.lon

            };

            postData('/add', weatherForcastSave) // TODO jumps to postData maybe wrong
            return weatherForcastSave;
        } catch (error) {
            // appropriately handle the error
            console.log("error3", error);

        }

    } else {
        const res = await fetch(weatherbitApiHis)
            // if everything goes well and we get our data back, it will conduct try 
        try {
            // Get new data that is in JSON format using .json method
            const weatherForcastData = await res.json();
            // console the data 
            // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
            // 2
            const weatherForcastSave = {

            }
            weatherForcastData.city_name = city_name;
            weatherForcastData.state_code = state_code;
            weatherForcastData.min_temp = min_temp;
            weatherForcastData.max_tem = max_temp;
            weatherForcastData.sunrise = sunrise;
            weatherForcastData.sunset = sunset;
            "data not available beyond 16 days" = description;
            weatherdata.lon = lon;
            weatherdata.lat = lon;


            postData('/add', weatherForcastData) // jumps to postData
            return weatherForcastSave;
        } catch (error) {
            // appropriately handle the error
            console.log("error4", error);
        }

    }
}



// https://pixabay.com/api/?key=16612659-a3ef7a4e4200e1d68ec5b75fb&q=boston&image_type=photo
const getpixbay = async() => {
    //Call the API 
    //The API Key variable is passed as a parameter to 
    const placename = document.getElementById("UserCity").value;
    const pixabayAPI = `${pixabayAPIURL}${pixabayAPIkey}&q=${placename}&image_type=photo`;
    console.log(pixabayAPI)
    const res = await fetch(pixabayAPI);
    // if everything goes well and we get our data back, it will conduct try 
    try {
        // Get new data that is in JSON format using .json method
        const pixImageData = await res.json();
        const ImageURLSave = {
            imageURL: pixImageData.hits[0].webformatURL
        };
        // console the data 
        // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
        // 2
        // postData()

        console.log('get image success');

        postData('/add', (ImageURLSave)) // jumps to postData
    } catch (error) {
        // appropriately handle the error
        console.log("error5", error);

    }
}












// update weather related UI
const updateUI = async() => {
    const request = await fetch('/');
    const UIData = await request.json();
    console.log(UIData)
    const imageURL = UIData.imageURL;
    const city_name = UIData.city_name;
    const state_code = UIData.state_code;
    const min_temp = UIData.min_temp;
    const max_temp = UIData.max_temp;
    const sunrise = UIData.sunrise;
    const sunset = UIData.sunset;
    const description = UIData.description;
    const countryName = UIData.contryName;
    const dayLeft = UIData.dayLeft;

    try {

        document.getElementById("distinationImg").innerHTML = '<img src=' + UIData.imageURL + '>'
        document.getElementById("UserCity").innerHTML = UIData.city_name + ',' + UIData.state_code + ',' + UIData.countryName;
        document.getElementById('DepartDate').innerHTML = 'Departing: ' + UIData.DepartDate;
        document.getElementById('dayLeft').innerHTML = UIData.dayLeft + 'days away';
        document.getElementById('temp').innerHTML = UIData.min_temp + 'To' + UIData.max_temp;

    } catch (error) {
        console.log("error3", error);
    }
}