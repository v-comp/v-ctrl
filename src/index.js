import throttle from 'lodash/throttle'

const clamp = function (value, min, max) {
  return Math.max(min, Math.min(value, max))  
}

const vCtrlComponent = {
  name: 'v-ctrl',
  abstract: true,
  props: {
    direction: {
      type: String,
      default: 'h'
    },
    throttle: {
      type: Number,
      default: 80
    }
  },

  methods: {
    onMousedown (e) {
      e.preventDefault()
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
      this.updateValue(e)
    },
  
    onMouseMove (e) {
      e.preventDefault()
      this.updateValue(e)
    },
  
    onMouseUp (e) {
      this.updateValue(e)
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    },
  
    updateValue ({ clientX = 0, clientY = 0 } = {}) {
      const rect = this.$el.getBoundingClientRect()
      const { left, top, width, height } = rect

      const deltaX = clientX - left
      const deltaY = clientY - top

      const x = clamp(deltaX / width, 0, 1)
      const y = clamp(deltaY / height, 0, 1)

      const dir = this.direction
      // eslint-disable-next-line
      const data = dir === 'vh' ? { x, y } : (dir === 'v' ? y : x)

      this.$emit('change', data)
    }
  },

  render (h) {
    return this.$slots.default[0]
  },

  created () {
    const { direction, onMousedown, onMouseMove } = this

    if (direction === 'hv') {
      this.direction = 'vh'
    }

    this.onMousedown = onMousedown.bind(this)
    this.onMouseMove = throttle(onMouseMove.bind(this), this.throttle)
  },

  mounted () {
    this.$el.addEventListener('mousedown', this.onMousedown)
  },

  destroyed () {
    this.$el.removeEventListener('mousedown', this.onMousedown)
  },

  install () {
    Vue.component(vCtrlComponent.name, vCtrlComponent)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(vCtrlComponent)
}

export default { vCtrlComponent }
