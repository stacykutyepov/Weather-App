// Weather Forecast APP
const timeText = document.querySelector('.time-text');
const timeSpec = document.querySelector('.time-spec');
const locationText = document.querySelector('.location-text');
const todayTemp = document.querySelector('.today-temp p');


const appController = (function () {

  // Get time
  const time = new Date().toLocaleTimeString();
  const text = time.slice(0, 5)
  const spec = time.slice(time.length - 2, time.length);

  const displayTime = () => {
    timeText.textContent = text;
    timeSpec.textContent = spec.toLowerCase();
  }


  // format time to AM & PM
  const formatTime = (time) => {
    var h = time.slice(11, 13);
    let dd = "AM";
    var hh = h;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    return h + " " + dd;
  };

  // Convert UTC to day of the week
  function getDayofTheWeek(dt) {
    var days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];
    var dayNum = new Date(dt * 1000).getDay();
    var result = days[dayNum];
    // console.log(result);
    return result;
  }

  // Geolocation
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
  }

  // Set Up Object with all data

  function setUpData(data) {
    var weatherObj = {};
    var allTemp;
    var allIcons;
    for (let i in data.list) {
      var day = getDayofTheWeek(data.list[i].dt);
      allTemp = Math.floor(data.list[i].main.temp);
      allIcons = data.list[i].weather[0].icon;
      if (weatherObj[day] == undefined) {
        weatherObj[day] = {};
        weatherObj[day].temps = [];
        weatherObj[day].icons = [];
      }
      weatherObj[day].temps.push(allTemp);
      weatherObj[day].tempHigh = Math.max(...weatherObj[day].temps);
      weatherObj[day].tempLow = Math.min(...weatherObj[day].temps);
      weatherObj[day].icons.push(allIcons);

    }
    return weatherObj;
  }

  function displayUI(city, country) {
    locationText.textContent = `${city}, ${country}`;
  }

  //Work with API
  async function getWeather(latitude, longitude) {
    const key = `494a76302024db23035d814ee5934e4e`;
    try {
      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`
      );
      const data = await result.json();

      const cityName = data.city.name.toUpperCase();
      const country = data.city.country.toUpperCase();
      const today = Math.floor(data.list[0].main.temp);
      const todayFeelsLike = Math.floor(data.list[0].main.feels_like);
      const tomorrow = data.list[5].main.temp;

      displayUI(cityName, country);

      console.log(data);

      console.log(
        `Today's temperature at ${formatTime(
          data.list[0].dt_txt
        )} is ${today} degreesC, and it feels like ${todayFeelsLike} degreesC`
      );

      const weather = setUpData(data);
      console.log(weather);

    } catch (error) {
      console.log(error);
    }
  }


  function init() {
    getLocation();
    displayTime();
  }
  init();
})();


//UI controller
const UIController = (() => {

})();

// Global controller