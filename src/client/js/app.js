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
// document.getElementById('generate').addEventListener('click', performAction);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Not part of module.exports but still appearing in terminal, why?');
    var button = document.getElementById('generate');
    button.addEventListener('click', performAction);
});


// Chain events
function performAction(e) {

    //make get request
    getGeoData()
        // New Syntax!
        .then(LocationData => {
            // Add data
            console.log('run random function');
            const saveDataForWeather = {}
                // saveDataForWeather.DepartDate = userDepartDate;
            console.log(LocationData);
            const lat = LocationData.geonames[0].lat;
            const lon = LocationData.geonames[0].lng;
            const countryName = LocationData.geonames[0].countryName;
            saveDataForWeather.lat = lat;
            saveDataForWeather.lon = lon;
            saveDataForWeather.countryName = countryName;
            console.log('lat is ', lat, 'lon is ', lon, countryName);
            postData('/add', saveDataForWeather)
        })
        .then(
            getWeatherForcastData
        )
        .then(
            getpixbay
        )
        .then(
            updateUI
        )
}




// Make a GET request to get GeoData
const getGeoData = async() => {
    console.log('Run getGeoData')
        //Call the API 
        //Call the API 
        //Call the API 
        //The API Key variable is passed as a parameter to 
        //The API Key variable is passed as a parameter to 
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
        return geoData;

    } catch (error) {
        // appropriately handle the error
        console.log("error1", error);

    }
}




// Async POST 
// Post Route: take two arguments, the URL to make a POST to, and an object holding the data to POST.
const postData = async(url = '', data = {}) => {
    console.log('Run postData')
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

    console.log(url, data, 'postData check point 1')
    console.log(response)

    try {
        const UIData = await response.json();
        console.log("add success");
        return UIData
    } catch (error) {
        console.log("error2-----", error);
    }
}


// Make a GET request to get WeatherForcastData
const getWeatherForcastData = async() => {
    //fetch to get ln & lat
    console.log('Run getWeatherForcastData')
    const res = await fetch('/all');
    const weatherdata = await res.json();
    const lon = weatherdata.lon;
    const lat = weatherdata.lat;

    //Call the API 
    //The API Key variable is passed as a parameter to 
    const userDepartDate = document.getElementById("DepartDate").value;
    const userBackDate = document.getElementById("EndDate").value;
    console.log(userDepartDate, ' fdsaffd')
    const tempDate = new Date(userDepartDate);
    const timestampDepart = (new Date(userDepartDate).getTime()) / 1000;
    const timestampBack = (new Date(userBackDate).getTime()) / 1000;
    const dayLeft = Math.round((timestampDepart - timestampNow) / (60 * 60 * 24));
    const daylength = Math.round((timestampBack - timestampDepart) / (60 * 60 * 24));
    console.log('day left ---- ', dayLeft)
        //Transform depart date in YYYY-MM-DD
        // let DepartHisFormat = tempDate.getFullYear() + '-' + tempDate.getMonth() + '-' + tempDate.getDate();
        // let DepartHisFormatTom = tempDate.getFullYear() - 1 + '-' + tempDate.getMonth() + '-' + tempDate.getDate();


    // let DepartHisFormat = "2019-05-27"
    // let DepartHisFormatTom = "2019-05-27"

    let departDate_past = new Date(userDepartDate)
    departDate_past.setFullYear(departDate_past.getFullYear() - 1);
    console.log('history data get', departDate_past)

    var DepartHisFormat = departDate_past.toISOString().substring(0, 10);


    console.log('Dapartdate calculated', DepartHisFormat)


    console.log(DepartHisFormat);
    // const weatherbitURL = "https://api.weatherbit.io/v2.0/forecast/daily?";
    // const weatherbitAPIkey = "10a49528e4074f59b926a3d566b9caeb";
    //Day left < 16, get weather from forcast
    //https://api.weatherbit.io/v2.0/forecast/daily?lat=51.50853&lon=-0.12574&days=10&key=10a49528e4074f59b926a3d566b9caeb
    const weatherbitApiFuthure = `${weatherbitURL}lat=${lat}&lon=${lon}&days=${dayLeft}&key=${weatherbitAPIkey}`;
    // Day left >16, get weather data from history data
    //https://api.weatherbit.io/v2.0/history/daily?lat=35.775&lon=-78.638&start_date=2020-05-17&end_date=2020-05-18&tz=local&key=10a49528e4074f59b926a3d566b9caeb
    const weatherbitApiHis = `${weatherbitURL}lat=${lat}&lon=${lon}&key=${weatherbitAPIkey}&start_date=${DepartHisFormat}&end_date=${DepartHisFormat}`;

    if (dayLeft < 16) {
        const res = await fetch(weatherbitApiFuthure)
            // if everything goes well and we get our data back, it will conduct try 
            // try {
        const weatherForcastData = await res.json();
        console.log(weatherForcastData)
        const weatherForcastSave = {}
        weatherForcastSave.city_name = weatherForcastData.city_name;
        weatherForcastSave.state_code = weatherForcastData.state_code;
        weatherForcastSave.min_temp = weatherForcastData.data[0].min_temp;
        weatherForcastSave.max_temp = weatherForcastData.data[0].max_temp;
        weatherForcastSave.lon = weatherForcastData.lon;
        weatherForcastSave.lat = weatherForcastData.lat;
        weatherForcastSave.userDepartDate = userDepartDate;
        weatherForcastSave.userBackDate = userBackDate;
        weatherForcastSave.dayLeft = dayLeft;
        weatherForcastSave.daylength = daylength;
        weatherForcastSave.description = weatherForcastData.data[0].weather.description;

        console.log('weatherForcastData before postData --------------------')
        postData('/addweather', weatherForcastSave) // jumps to postData
        return weatherForcastSave;

    } else {
        const res = await fetch(weatherbitApiHis)
            // if everything goes well and we get our data back, it will conduct try 
            // try {
            // Get new data that is in JSON format using .json method
        console.log(res)
        const weatherForcastData = await res.json();
        // console the data 
        // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
        // 2
        console.log(weatherForcastData)
        const weatherForcastSave = {

        }
        weatherForcastSave.city_name = weatherForcastData.city_name;
        weatherForcastSave.state_code = weatherForcastData.state_code;
        weatherForcastSave.min_temp = weatherForcastData.data[0].min_temp;
        weatherForcastSave.max_temp = weatherForcastData.data[0].max_temp;
        weatherForcastSave.lon = weatherForcastData.lon;
        weatherForcastSave.lat = weatherForcastData.lat;
        weatherForcastSave.userDepartDate = userDepartDate;
        weatherForcastSave.userBackDate = userBackDate;
        weatherForcastSave.dayLeft = dayLeft;
        weatherForcastSave.daylength = daylength;
        weatherForcastSave.description = 'not available';


        console.log('weatherForcastData before postData --------------------')
        postData('/addweather', weatherForcastSave) // jumps to postData
        return weatherForcastSave;
        // } catch (error) {
        //     // appropriately handle the error
        //     console.log("error4", error);
        // }

    }
}







// https://pixabay.com/api/?key=16612659-a3ef7a4e4200e1d68ec5b75fb&q=boston&image_type=photo
const getpixbay = async() => {
    //Call the API 
    //The API Key variable is passed as a parameter to 
    console.log('Run getpixbay')
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

        postData('/addphoto', (ImageURLSave)) // jumps to postData
    } catch (error) {
        // appropriately handle the error
        console.log("error5", error);

    }
}












// update weather related UI
const updateUI = async() => {
    console.log('Run updateUI')
    const request = await fetch('/all');
    console.log('fetch from /all')
    const UIData = await request.json();
    console.log('This is the result from fetch from /all %%%%%%%%%%%')
    console.log(UIData)
        // const imageURL = UIData.imageURL;
        // const city_name = UIData.city_name;
        // const state_code = UIData.state_code;
        // const min_temp = UIData.min_temp;
        // const max_temp = UIData.max_temp;
        // const sunrise = UIData.sunrise;
        // const sunset = UIData.sunset;
        // const description = UIData.description;
        // const countryName = UIData.contryName;
        // const dayLeft = UIData.dayLeft;
        // const daylength = UIData.daylength;

    console.log('Run updateUI try')
    console.log('city_name', UIData.city_name)
        // try {
    document.getElementById("distinationImg").innerHTML = '<img src=' + UIData.imageURL + '>';
    // document.getElementById("UserCityName").innerHTML = UIData.city_name + ', ' + UIData.state_code + ', ' + UIData.countryName;
    document.getElementById("UserCityName").innerHTML = UIData.city_name + ', ' + UIData.countryName;
    document.getElementById('UserDepartDate').innerHTML = 'Start Date:  ' + UIData.userDepartDate;
    document.getElementById('UserBackDate').innerHTML = 'End Date:  ' + UIData.userBackDate;
    document.getElementById('dayLeft').innerHTML = ' Total trip is ' + UIData.daylength + ' days, it is ' + UIData.dayLeft + ' days away';
    document.getElementById('temp').innerHTML = ' Temperature will be ' + UIData.min_temp + '°C' + ' To ' + UIData.max_temp + '°C';
    document.getElementById('summary').innerHTML = UIData.description;
    // } catch (error) {
    //     console.log("error3", error);
    // }
}