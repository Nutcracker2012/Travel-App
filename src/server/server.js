// Setup empty JS object to act as endpoint for all routes
var projectData = {};

// Require Express to run server and routes
var path = require('path')
const express = require('express');
const bodyParser = require('webpack-body-parser');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());


// // API
const dotenv = require('dotenv');
dotenv.config();

// / set aylien API credentials
// // NOTICE that textapi is the name I used, but it is arbitrary.
// // You could call it aylienapi, nlp, or anything else, 
// //   just make sure to make that change universally!
// var textapi = new aylien({
// application_id: process.env.API_ID,
// application_key: process.env.API_KEY
// });



// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
//assign port number as 3000
const port = 3000;
// const server = app.listen(port, listening);

// function listening() {
//     console.log(`running on localhost: ${port}`);
// };
// The same code using the arrow function
const server = app.listen(port, () => { console.log(`running on localhost:${port}`) })


//GET Route I:
//Getrequest, first argument is a string that represents the URL path
// Route named 'all' so that the route 'localhost:8000/all' will noew trigger the GET request, which will return the  JavaScript object as laid out in the server code above.
app.get('/all', function(req, res) {
    res.send(projectData);
});

//Post Route
//collect and store user data so that the app can access it later is through making an HTTP POST request
//POST data to the app end point projectData{}
//crate an API named add
app.post('/forWeatherAPI', function(req, res) {

    let newEntry = {
        lat: req.body.lat,
        lon: req.body.lon,
        DepartDate: req.body.DepartDate
    };
    projectData.push(newEntry);
    res.send(projectData);
    console.log(projectData);

});

app.get('/', function(req, res) {
    res.sendFile('dist/index.html')
})

// Post Route
app.post('/add', function(req, res) {

    console.log('fdsafda')
    projectData.lat = req.body.lat;
    projectData.lon = req.body.lon;
    projectData.countryName = req.body.countryName;
    // projectData['sunrise'] = req.body.sunrise;
    // projectData['sunset'] = req.body.sunset;
    // projectData['description'] = req.body.description;
    // projectData['countryName'] = req.body.countryName;
    // projectData['dayLeft'] = req.body.dayLeft;
    // projectData['imageURL'] = req.body.imageURL;
    // console.log('fdsafda22', projectData['imageURL'], projectData['dayLeft'], projectData['city_name'])
    res.send(projectData);

})


app.post('/addweather', function(req, res) {

    console.log('fdsafda')
    projectData.city_name = req.body.city_name;
    projectData.state_code = req.body.state_code;
    projectData.min_temp = req.body.min_temp;
    projectData.max_temp = req.body.max_temp;
    projectData.userDepartDate = req.body.userDepartDate;
    projectData.userBackDate = req.body.userBackDate;
    projectData.dayLeft = req.body.dayLeft;
    projectData.daylength = req.body.daylength;
    projectData.description = req.body.description;

    // weatherForcastData.sunset = sunset;
    // "data not available beyond 16 days" = description;
    res.send(projectData);

})




app.post('/addphoto', function(req, res) {

    console.log('fdsafdaaddphoto')
    projectData.imageURL = req.body.imageURL;

    // weatherForcastData.sunrise = sunrise;
    // weatherForcastData.sunset = sunset;
    // "data not available beyond 16 days" = description;
    res.send(projectData);

})


//export
module.exports = app;