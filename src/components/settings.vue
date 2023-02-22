<template>
  <div class="settings">
    <button
      @mouseup="$emit('closeSettings')" class="settings__close-button"
    >
      <img class="settings__cities-close-icon" src="../assets/close.png" alt="close icon"/>
    </button>
    <div class="settings__top-wrapper">
      <p class="settings__header">Settings</p>
      <draggable
        :list="cities"
        v-bind="dragOptions"
        handle=".settings__cities-burger"
        class="settings__cities-list"
        @start="dragStart()"
        @end="dragStop(cities)"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <div
            v-for="(city, index) in cities"
            :key="index * 100"
            class="settings__cities-item"
          >
            <span class="settings__cities-burger">
              <img class="settings__cities-burger-icon" src="../assets/burger.png" alt="burger icon"/>
            </span>
            <span>{{ getName(city) }}, {{ getCountry(city) }}</span>
            <button class="settings__cities-delete-button" @mousedown="removeCity(index)">
              <img class="settings__cities-delete-icon" src="../assets/delete.png" alt="delete icon"/>
            </button>
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="settings__top-wrapper">
      <div class="hints">
        <div
          v-for="(item, index) in response"
          :key="index"
          @mouseup="addLocation(item)"
          class="hints__item"
        >
          {{ item.name }}<span>( {{ item.country }} )</span>
        </div>
      </div>
      <label for="City" class="settings__input-label">
        <span class="settings__input-label-text">Add location</span>
        <input
          v-model="city"
          id="City"
          type="text"
          placeholder="City"
          autocomplete="off"
          class="settings__input"
          @input="onChange"
          @focusout="crearHints()"
        />
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'

export default Vue.extend({
  name: 'AppSettings',
  display: 'Transitions',
  props: {
    cities: {
      type: Array,
      require: true,
    },
    response: {
      type: Array,
      require: true,
    }
  },
  data() {
    return {
      city: '' as string,
      drag: false as boolean,
    }
  },
  components: {
    draggable
  },
  methods: {
    dragStart(): void {
      this.drag = true
    },
    dragStop(cities: string): void {
      this.drag = false
      this.$emit('updateCities', cities)
    },
    onChange(): void {
      this.$emit('search', this.city)
    },
    addLocation(city: string): void {
      this.$emit('addLocation', city)
      this.city = ''
    },
    removeCity(index: number): void {
      this.$emit('removeCity', index)
    },
    crearHints(): void {
      setTimeout(
        () => {
          this.$emit('crearHints')
          this.city = ''
        }, 30
      )
    },
    getCountry (obj: object): string {
      return obj?.country || ''
    },
    getName (obj) {
      return obj?.name || ''
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
  },
})
</script>

<style scopped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.settings {
  min-height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.settings__top-wrapper {

}
.settings__bottom-wrapper {

}
.settings__header {
  font-size: 18px;
  padding: 10px;
  padding-bottom: 10px;
  margin: 0;
  text-align: left;
}
.settings__close-button {
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
.settings__close-button:hover {
  opacity: 0.7;
}
.settings__cities-close-icon {
  height: 100%;
  width: auto;
}
.settings__cities-delete-button {
  background: none;
  border: none;
  width: 22px;
  height: 22px;
  padding: 0;
  margin: 0;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.settings__cities-delete-icon {
  height: 100%;
  width: auto;
}
.settings__cities-burger {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}
.settings__cities-burger-icon {
  height: 18px;
  width: auto;
}
.settings__cities-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
}
.settings__cities-item {
  display: flex;
  gap: 14px;
  width: 297px;
  padding: 8px 10px;
  margin: 4px auto;
  justify-content: left;
  position: relative;
  background-color: #ececec;
}
.settings__input-label-text {
  width: 61%;
  display: block;
  margin: 0 auto;
  text-align: left;
  line-height: 28px;
}
.settings__input {
  width: 60%;
}
.settings__input-label {
  bottom: 0;
  width: 100%;
  left: 0;
}
.hints {
  position: absolute;
  bottom: 55px;
  min-width: 318px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  right: 50%;
  transform: translateX(50%);
}
.hints__item {
  padding: 6px;
  cursor: pointer;
}
.hints__item:hover {
  background-color: #d5e3f0;
}
</style>
