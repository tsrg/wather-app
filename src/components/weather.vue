<template>
  <div>
    <button class="weather__settings-button" @mouseup="$emit('openSettings')">
      <img class="weather__settings-icon" src="../assets/settings.png" alt="settings icon"/>
    </button>
    <div
      v-for="(item, index) in weather"
      :key="index + listKey"
      class="city"
    >
      <div class="city__name">{{ getName(item) }}, {{ getCountry(item) }}</div>
      <div class="city__weather-img-wrapper">
        <img class="city__weather-img" :src="getImg(item)" :alt="getWeatherName(item)" />
      </div>
      <div class="city__weather-temp"><span class="city__weather-temp-text">{{ getTemp(item) }}&#8451;</span></div>
      <div class="city__weather-feel">Feels like {{ getFeel(item) }}&#8451;.</div>
      <div class="city__weather-name">{{ getWeatherName(item) }}.</div>
      <div class="city__weather-description">{{ getWeatherDescription(item) }}</div>
      <div class="city__option city__option_type_wind-speed">
        <span class="city__option_type_wind-text">{{ getWindSpeed(item) }} m/s</span>
      </div>
      <div class="city__option">{{ getPressure(item) }}</div>
      <div class="city__option">Humidity {{ getHumidity(item) }}%</div>
      <div class="city__option">Visibility {{ getVisibility(item) }}km</div>
      <div class="city__option">Dew point {{ getDewPoint(item) }}&#8451;</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppSettings',
  props: {
    cities: {
      type: Array,
      require: true,
    },
    weather: {
      type: Array,
      require: true,
    },
    listKey: {
      type: Number,
      default: 2
    }
  },
  methods: {
    getName (obj): string {
      console.log('name')
      console.log(obj)
      return obj?.name || ''
    },
    getCountry (obj) {
      return obj?.sys?.country || ''
    },
    getTemp (obj) {
      return Math.round(obj.main?.temp) || 0
    },
    getFeel (obj) {
      return Math.round(obj.main?.feels_like) || 0
    },
    getWindSpeed (obj) {
      return obj?.wind?.speed || 0
    },
    getWindDeg (obj) {
      return obj?.wind?.deg || 0
    },
    getWindGust (obj) {
      return obj?.wind?.gust || 0
    },
    getImg (obj) {
      const iconName = obj.weather?.[0].icon || 0
      return `http://openweathermap.org/img/wn/${iconName}@2x.png`
    },
    getVisibility (obj) {
      return (obj?.visibility / 1000).toFixed(1) || 0
    },
    getHumidity (obj) {
      return obj?.main?.humidity || 0
    },
    getWeatherName (obj) {
      return obj?.weather?.[0]?.main || ''
    },
    getWeatherDescription (obj) {
      return obj?.weather?.[0]?.description || ''
    },
    getPressure (obj) {
      return obj?.main?.pressure || 0
    },
    getDewPoint (obj) {
      const t = this.getTemp (obj)
      const Rh = this.getHumidity(obj)
      const a = 17.27;
      const b = 237.7;
      const f = () => {
        return (a * t) / (b + t) + Math.log(Rh/100) || 0
      }
      return Math.round(b * f() / ( a - f() )) || 0
    },
  },
})
</script>

<style>
.city {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 12px;
  padding-bottom: 12px;
}
.city__name {
  width: 100%;
  font-size: 17px;
  text-align: left;
  font-weight: 600;
  padding-left: 14px;
}
.city__weather-img-wrapper {
  width: 50%;
}
.city__weather-img {
  width: auto;
  height: auto;
}
.city__weather-temp {
  width: 50%;
  align-self: center;
  text-align: left;
  font-size: 3em;
}
.city__weather-feel {
  padding-right: 6px;
}
.city__weather-name {
  padding-right: 6px;
}
.city__weather-description {
  text-transform: capitalize;
}
.city__weather-temp-text {
  /* font-size: 6em;
  align-self: flex-start; */
}
.weather__settings-button {
  background: none;
  border: none;
  width: 22px;
  height: 22px;
  padding: 0;
  margin: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
.weather__settings-button:hover {
  opacity: 0.7;
}
.weather__settings-icon {
  height: 100%;
  width: auto;
}
.city__option {
  width: 50%;
  padding-top: 10px;
}
</style>
