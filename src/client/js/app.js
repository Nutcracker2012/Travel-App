//Use base URL and Key to queryAPI database based on Web API documntation
//https://openweathermap.org/current
/* Global Variables */

let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let apiKey = 'a424bc3e1a842426a9b039b57e52dd99';

const projectData = {}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();


//chain the events
document.getElementById('generate').addEventListener('click', performAction);

// Chain events
function performAction(e) {

    //make get request
    getWeatherData()
        // New Syntax!
        .then(tempData => {
            // Add data
            const userfeelings = document.getElementById("feelings").value;

            const saveData = {}
            saveData.content = userfeelings;
            console.log(tempData);
            const temp = tempData.main.temp;
            saveData.temp = temp;
            console.log('temp is ', temp, 'post is ', userfeelings);
            //Add data to POST request
            //passing in the URL of the POST route, and an object containing the data to be posted.

            saveData.date = newDate;
            console.log(saveData)

            postData('/add', saveData)
        })
        .then(
            updateUI
        )
}




// Get Route II
// Make a GET request to get weatherData
const getWeatherData = async() => {
    //Call the API 
    //The API Key variable is passed as a parameter to 
    const userzip = document.getElementById("zip").value;
    const api = `${baseURL}${userzip}&appid=${apiKey}`;
    console.log(api)
    const res = await fetch(api)
        // if everything goes well and we get our data back, it will conduct try 
    try {
        // Get new data that is in JSON format using .json method
        const weatherData = await res.json();
        // console the data 
        // 1. we can do something with our returned data here, such as that we could chain events so that we can do something else with that data
        // 2
        // postData()
        console.log('get weatherdata success');
        return weatherData;

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
        const newData = await response.json();
        console.log("add success");
        return newData
    } catch (error) {
        console.log("error2", error);
    }
}




// const updateUI = async() => {

// }


// update UI
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const UIData = await request.json();
        const length = UIData.length
        console.log(UIData)
        document.getElementById("date").innerHTML = 'Today is ' + UIData[length - 1].date;
        document.getElementById('temp').innerHTML = 'Temperature is ' + UIData[length - 1].temp;
        document.getElementById('content').innerHTML = 'I feel ' + UIData[length - 1].content;

    } catch (error) {
        console.log("error3", error);
    }
}