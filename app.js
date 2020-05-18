// Weather Forecast APP
const timeText = document.querySelector('.time-text');
const timeSpec = document.querySelector('.time-spec');
const locationText = document.querySelector('.location-text');
const todayTemp = document.querySelector('.today-temp');
const todayIcon = document.querySelector('.today-icon');
const container = document.querySelector('.container');


const appController = (function () {



  const setUpTheme = () => {
    const time = new Date().getHours();
    const changeColor = (prop) => {
      timeText.style.color = prop;
      timeSpec.style.color = prop;
      locationText.style.color = prop;
    }
    if (time < 6 || time >= 20) {
      container.style.backgroundImage = `url(./Back-img/evening_01.jpeg)`;
      changeColor('white');
    } else if (time >= 6 && time <= 13) {
      container.style.backgroundImage = `url(./Back-img/morning_01.jpeg)`;
      changeColor('black');
    } else if (time > 13 && time < 20) {
      container.style.backgroundImage = `url(./Back-img/afternoon_02.jpeg)`
      changeColor('white');
    }
  }

  const displayTime = () => {
    // Get time
    let text = '';
    const time = new Date().toLocaleTimeString();
    const spec = time.slice(time.length - 2, time.length);
    if (time.length > 10) {
      text = time.slice(0, 5);
    } else {
      text = time.slice(0, 4)
    }
    // Display time
    timeText.textContent = text;
    timeSpec.textContent = spec.toLowerCase();
  }

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
  const getDayofTheWeek = (dt) => {
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
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  const setPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
  }

  // Set Up Object with all data
  const setUpData = (data) => {
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

  const displayLocation = (city, country) => {
    locationText.textContent = `${city}, ${country}`;
  }

  const displayTodaysWeather = (temp, icon) => {
    todayTemp.textContent = `${temp}°`;
    todayIcon.style.backgroundImage = `url(./icons/${icon}.png)`;
  }

  const displayAllWeather = (day, icon, tempMax, tempMin) => {

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
      const todayTemp = Math.floor(data.list[0].main.temp);
      const todayIcon = data.list[0].weather[0].icon;
      const todayFeelsLike = Math.floor(data.list[0].main.feels_like);
      const tomorrow = data.list[5].main.temp;


      console.log(
        `Today's temperature at ${formatTime(
          data.list[0].dt_txt
        )} is ${todayTemp} degreesC, and it feels like ${todayFeelsLike} degreesC`
      );

      const weather = setUpData(data);
      console.log(weather);
      displayLocation(cityName, country);
      displayTodaysWeather(todayTemp, todayIcon)
      console.log(data);

    } catch (error) {
      console.log(error);
    }
  }


  function init() {
    getLocation();
    setUpTheme();
    displayTime();
  }
  init();
})();


//UI controller
const UIController = (() => {

})();

// Global controller