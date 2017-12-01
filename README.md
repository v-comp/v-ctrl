# v-ctrl

An Vue abstract component for mouse dragging, i.e. the pattern below:

```
--down--move--move---move--...---up--|-->
```

## Install

```bash
npm install --save v-ctrl

# or
yarn add v-ctrl
```

Or just add a `script` tag in you html:

```html
<script src="https://unpkg.com/v-ctrl"></script>
```

## Demo

A simple range slider:

```html
<template>
  <div class="wrapper">
    <v-ctrl direction="h" :throttle="80" @change="onChange">
      <div class="range-slider">
        <div class="progress" :style="{ width: percentage }"></div>
        <div class="thumb" :style="{ left: percentage }"></div>
      </div>
    </v-ctrl>
    <p>{{value}}</p>
  </div>
</template>

<script>
  import VCtrl from 'v-ctrl'

  export default {
    components: {
      'v-ctrl': VCtrl
    },
  
    data () {
      return { value: 20 }
    },
  
    computed: {
      percentage () {
        return `${this.value}%`
      }
    },
  
    methods: {
      onChange (val) {
        this.value = Math.round(val * 100)
      }
    }
  }
</script>
```

[Live demo](https://v-comp.github.io/v-ctrl/)

## Attributes

### `throttle`: `Number`

Throttling time for mousemove.

### `direction`: `Enum('v', 'h', 'vh')`

* `h`: emit proportion for the horizontal axis, e.g. `0.52`
* `v`: emit proportion for the vertical axis, e.g `0.91`
* `vh`: emit proportion for both axis, e.g. `{ x: 0.24, y: 0.87 }`

## Event

### `change`

`change` event is emitted while keeping dragging.
