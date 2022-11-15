<template>
  <div class="panel panel-default">
    <div class="panel-body">
      <!--Only code you need is this label-->
      <label class="switch">
        <input type="checkbox" v-model="checkbox" />
        <div class="slider round"></div>
      </label>
      <p>{{ checkbox }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    stateCheckbox: Boolean,
  },
  data() {
    return {
      checkbox: window.localStorage.getItem('spaceModeEnabled') ?? this.$defaultSpaceModeEnabled,
    };
  },
  watch: {
    checkbox(newValue) {
      window.localStorage.setItem('spaceModeEnabled', newValue);
      window.dispatchEvent(new Event('localStorageChange'));
    },
  },
};
</script>

<style scoped lang="scss">
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
