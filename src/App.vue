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

<script>
import Vue from 'vue';
import * as api from './utils/api';
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
    };
  },
  components: {
    AppSettings,
    AppWeather,
    AppError,
  },
  mounted() {
      try {
        const localCities = JSON.parse(localStorage.getItem('cities'));
        if (localCities !== null) {
          this.cities = localCities;
        }
        if (this.cities && this.cities.length > 0) {
          this.updateWeather(this.cities);
        } else {
          this.runWithoutSavedLocations();
        }
      } catch(e) {
        console.error(e);
        localStorage.removeItem('cities');
      }
  },
  watch : {
    citiesLength: (val) => {
      if (!val) {
        runWithoutSavedLocations();
      }
    }
  },
  methods: {
    runWithoutSavedLocations () {
      if ("geolocation" in navigator) {
        this.getCurrentLocation();
      } else {
        this.errorMessage = "Cann't get your geolocation. Try to add your city manual."
      }
    },
    getCurrentLocation () {
      navigator.geolocation.getCurrentPosition(
        this.getWeatherForCurrentPosition,
        this.onGetLocationError,
        geoSettings
      )
    },
    onGetLocationError (error) {
      console.error(error);
      this.errorMessage = error.message + ' Try to add your city manual.';
      console.log(this.errorMessage);
    },
    async getWeatherForCurrentPosition (position) {
      
      console.log('coooooorddsss');
      console.log(position.coords);
      const coord = { lat: position.coords.latitude, lon: position.coords.longitude }
      this.getWeather(coord)
        .then((res) => {
          this.weather.push(res);
        })
        .catch((err) => {
          console.error(err.mesage);
        })
    },
    async updateWeather (cities) {
      this.weather = []
      cities.forEach((city, index) => {
          this.getWeather(city)
            .then((res) => {
              res.sort = index;
              this.weather.push(res)
            })
            .catch((err) => console.log(err));
      });
      this.weather.sort((a, b) => a.sort - b.sort);
    },
    crearHints () {
      this.response = [];
    },
    getWeather (coord) {
      return  api.getCityWeather(coord)
        .then((res) => { return res })
    },
    async search(coord) {
      api.getLocation(coord)
        .then((res) => { console.log(res); this.response = res; })
        .catch((err) => { console.error(err); });
    },
    toggleShowSettings () {
      this.showSettings = !this.showSettings
    },
    saveCities() {
      const parsedCities = JSON.stringify(this.cities);
      localStorage.setItem('cities', parsedCities);
    },
    addLocation(city) {
      this.cities.push(city);
      this.response = [];
      this.saveCities();
      this.updateWeather(this.cities);
    },
    updateCities(cities) {
      this.cities = cities;
      this.saveCities();
      this.updateWeather(this.cities);
      this.weatherListKey++;
    },
    removeCity(index) {
      this.cities.splice(index, 1);
      this.weather.splice(index, 1);
      this.saveCities();
    }
  },
  computed: {
    responseNames() {
      return this.response.map(item => item.name)
    },
    citiesLength() {
      return this.cities.length
    }
  },
});
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
