// Require the different packages needed
const express = require('express');
const https = require('https');
const path = require('path');
const exphbs = require('express-handlebars');

// Init express
const app = express();

//Sets app to use the handlebars engine
app.set('view engine', 'hbs');

//Sets handlebars configurations
app.engine('hbs', exphbs({
  layoutsDir: path.join(__dirname + '/views/layouts'),
  defaultLayout: 'index',
  extname: 'hbs'
}));

// Setup the middle ware. Parse the body and use a static folder
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Responding routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/index.html"));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname + "/public" + "/index.html"));
});

// Responding to the POST request
app.post('/weather', (req, res) => {

  // Get the city name provided by the user
  let city = req.body.city;
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=INSERT_API_KEY_HERE&units=metric`;

  // To get the json file from the openweather api
  https.get(url, response => {
    response.on('data', d => {
      let data = JSON.parse(d);

      // If there is no errors
      if (data.cod === 200) {
        let icon = data.weather[0].icon;
        let imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        res.render('weather', {
          layout: 'index',
          the_city: city,
          temp: data.main.temp,
          url: imgURL,
          max_temp: data.main.temp_max,
          min_temp: data.main.temp_min,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed
        });
      } else {
        // Check if the error is a 404 error
        if (parseInt(data.cod) === 404) {
          res.render('form', {
            message: `${city} city has not been added to the list yet...Try again later`
          });
        } else {
          // Other error
          res.render('form', {
            message: `Error code ${data.cod}, please contact Ghaith Chrit and try again later`
          });
        }
      }
    })
  })
});

// Error 404 page
app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname + "/public" + "/404.html"));
})

// Port to listen to
let port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listenning at port ${port}...`));