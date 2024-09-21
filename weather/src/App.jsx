import { useEffect, useState } from 'react'
import './App.css';
import PropTypes from "prop-types";
import searchIcon from './assets/search_img.png';
import snowIcon from './assets/snow_img.jpg';
import cloudIcon from './assets/cloud_img.png';
import drizzleicon from './assets/drizzle_img.png';
import windIcon from './assets/wind_img.png';
import rainIcon from './assets/rain_img.png';
import sunIcon from './assets/sun_img.png';
import humidityIcon from './assets/humidity_img.png';

const WeatherDetails = (props) =>{
  return (
    <>
    <div className='image'>
      <img src={props.icon} alt="Image" />
    </div>
    <div className='temp'>{props.temp} °C</div>
    <div className='location'>{props.city}</div>
    <div className='country'>{props.country}</div>
    <div className='cord'>
      <div>
        <span className='lat'>Latitude</span>
        <span>{props.lat}</span>
      </div>
      <div>
        <span className='log'>Longitude</span>
        <span>{props.log}</span>
      </div>
    </div>
    <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{props.humidity} %</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="wind" className='icon' />
          <div className='data'>
            <div className='wind-percent'>{props.wind} km/h</div>
            <div className='text'>Wind</div>
          </div>
        </div>
    </div>
    </>
  )
}
WeatherDetails.propTypes = {
  icon:  PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
}
function App() {
  const [text, setText] = useState("Coimbatore");

  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleicon,
    "03n": drizzleicon,
    "04d": drizzleicon,
    "04n": drizzleicon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  };

  const search = async() => {
    setLoading(true);
    let api_key = "12c772746c33ec4001fe5b2f07b6edd3"
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
    try{
      let res = await fetch(url);
      let data = await res.json()
      // console.log(data);
      if (data.cod === "404") {
        console.error("City not found")
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunIcon)
      setCityNotFound(false);
    }catch(error){
      console.error("An error occurred:", error.message);
      setError("An Error Occured while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type='text' className='cityInput' placeholder='Search for Location' onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
          <div className='search-icon'>
            <img src={searchIcon} alt='Search' onClick={()=> search()}/>
          </div>
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}
        <p className='copyright'>Designed by <span>Developer Jana</span></p>
      </div>
    </>
  )
}

export default App