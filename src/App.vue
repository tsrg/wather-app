<template>
  <div id="app" class="weather-app">
    <AppWeather
      v-if="!showSettings && !errorMessage"
      :cities="cities"
      :weather="weather"
      @openSettings="toggleShowSettings()"
    />
    <AppSettings
      v-if="showSettings && !errorMessage"
      :cities="cities"
      :weather="weather"
      :response="response"
      @search="search"
      @addLocation="addLocation"
      @updateCities="updateCities"
      @removeCity="removeCity"
      @closeSettings="toggleShowSettings()"
      @crearHints="crearHints()"
    />
    <AppError
      v-if="errorMessage"
      :error-message="errorMessage"
      @openSettings="showSettings=true; errorMessage=null"
    />
  </div>
</template>

<script lnag="ts">
import Vue from 'vue'
import * as api from './utils/api'
import AppWeather from './components/weather.vue'
import AppSettings from './components/settings.vue'
import AppError from './components/error.vue'
import geoSettings from './constants/constants'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      showSettings: false,
      cities: [],
      response: [],
      weather: [],
      weatherListKey: 1,
      errorMessage: null,
    }
  },
  components: {
    AppSettings,
    AppWeather,
    AppError,
  },
  mounted() {
      try {
        const localCities: Array = JSON.parse(localStorage.getItem('cities'))
        if (localCities !== null) {
          this.cities = localCities
        }
        if (this.cities && this.cities.length > 0) {
          this.updateWeather(this.cities)
        } else {
          this.runWithoutSavedLocations()
        }
      } catch(e) {
        console.error(e)
        localStorage.removeItem('cities')
      }
  },
  watch : {
    citiesLength: (val) => {
      if (!val) {
        this.runWithoutSavedLocations();
      }
    }
  },
  methods: {
    runWithoutSavedLocations (): void {
      if ('geolocation' in navigator) {
        this.getCurrentLocation()
      } else {
        this.errorMessage = "Cann't get your geolocation. Try to add your city manual."
      }
    },
    getCurrentLocation (): void {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherForCurrentPosition,
        this.onGetLocationError,
        geoSettings
      )
    },
    onGetLocationError (error): void {
      console.error(error)
      this.errorMessage = error.message + ' Try to add your city manual.'
      console.log(this.errorMessage)
    },
    async getWeatherForCurrentPosition (position): void { // Добавить тип позишн

      console.log('coooooorddsss')
      console.log(position.coords)
      const coord: { lat: number, lon: number } = { lat: position.coords.latitude, lon: position.coords.longitude }
      this.getWeather(coord)
        .then((res) => {
          this.weather.push(res)
        })
        .catch((err) => {
          console.error(err.mesage)
        })
    },
    async updateWeather (cities: Array<object>): void {
      this.weather = []
      cities.forEach((city: string, index: number) => {
          this.getWeather(city)
            .then((res) => {
              res.sort = index
              this.weather.push(res)
            })
            .catch((err) => console.log(err))
      })
      this.weather.sort((a, b) => a.sort - b.sort)
    },
    crearHints (): void {
      this.response = []
    },
    getWeather (coord): Promise {
      return  api.getCityWeather(coord)
        .then((res) => { return res })
    },
    async search(coord): void {
      api.getLocation(coord)
        .then((res) => { console.log(res); this.response = res })
        .catch((err) => { console.error(err) })
    },
    toggleShowSettings (): void {
      this.showSettings = !this.showSettings
    },
    saveCities(): void {
      const parsedCities: string = JSON.stringify(this.cities)
      localStorage.setItem('cities', parsedCities)
    },
    addLocation(city: object): void {
      this.cities.push(city)
      this.response = []
      this.saveCities()
      this.updateWeather(this.cities)
    },
    updateCities(cities: Array<object>): void {
      this.cities = cities
      this.saveCities()
      this.updateWeather(this.cities)
      this.weatherListKey++
    },
    removeCity(index: number): void {
      this.cities.splice(index, 1)
      this.weather.splice(index, 1)
      this.saveCities()
    }
  },
  computed: {
    responseNames(): Array<string> {
      return this.response.map(item => item.name)
    },
    citiesLength(): number {
      return this.cities.length
    }
  },
})
</script>

<style scopped>
.weather-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 320px;
  overflow-y: scroll;
  position: relative;
}
.btn {
  display: inline-block;
  background-color: #2c3e50;
  width: 20px;
  height: 20px;
}
</style>
