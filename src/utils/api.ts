import { watherApiURl, geoApiURL, citySearchResponseLimit } from '@/constants/constants'
import {getCityWeatherData} from '@/types/index'

const apiKey: string = process.env.VUE_APP_API_KEY

const handleOriginalResponse = (res: any) => {
  if (!res.ok) {
    return Promise.reject(new Error(`Error: ${res.status}`))
  }
  return res.json()
}

export const getLocation = (data: string): Promise<T> => {
  return fetch(`${geoApiURL}?q=${data}&limit=${citySearchResponseLimit}&appid=${apiKey}`, {
    method: 'GET',
  })
    .then(handleOriginalResponse)
}

export const getCityWeather = (data: getCityWeatherData): Promise<T> => {
  console.log(data)
  return fetch(`${watherApiURl}?lat=${data.lat}&lon=${data.lon}&appid=${apiKey}&units=metric`, {
    method: 'GET',
  })
    .then(handleOriginalResponse)
}
