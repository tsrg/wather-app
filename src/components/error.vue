<template>
  <div class="error">
    <div>
      {{ errorMessage }}
    </div>
    <button @mouseup="$emit('openSettings')">
      add location
    </button>
  </div>
</template>
<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'AppError',
  props: {
    errorMessage: {
      type: String,
      require: true,
    }
  }
})
</script>
