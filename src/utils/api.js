import { watherApiURl, geoApiURL, citySearchResponseLimit } from '../constants/constants';

const apiKey = process.env.VUE_APP_API_KEY;

const handleOriginalResponse = (res) => {
  if (!res.ok) {
    return Promise.reject(new Error(`Error: ${res.status}`));
  }
  return res.json()
}

export const getLocation = (data) => {
  return fetch(`${geoApiURL}?q=${data}&limit=${citySearchResponseLimit}&appid=${apiKey}`, {
    method: 'GET',
  })
    .then(handleOriginalResponse)
}

export const getCityWeather = (data) => {
  console.log(data);
  return fetch(`${watherApiURl}?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=metric`, {
    method: 'GET',
  })
    .then(handleOriginalResponse)
}
