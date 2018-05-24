import throttle from 'lodash/throttle'
import clamp from 'lodash/clamp'
import isEqual from 'lodash/isEqual'

const toPrecision = function (num, precision) {
  const p = precision | 0
  return p > 0 ? parseFloat(num.toFixed(p)) : num
}

const VueCtrlComponent = {
  name: 'v-ctrl',
  abstract: true,
  props: {
    direction: {
      type: String,
      default: 'h',
      validator (val) {
        return ['v', 'h', 'vh', 'hv'].indexOf(val) > -1
      }
    },
    throttle: {
      type: Number,
      default: 80
    },
    precision: {
      type: Number
    }
  },

  methods: {
    msdown (e) {
      e.preventDefault()
      document.addEventListener('mousemove', this.msmove)
      document.addEventListener('mouseup', this.msup)
      this.next(e)
    },
  
    msmove (e) {
      e.preventDefault()
      this.next(e)
    },
  
    msup (e) {
      this.next(e)
      document.removeEventListener('mousemove', this.msmove)
      document.removeEventListener('mouseup', this.msup)
    },
  
    notify (val) {
      if (isEqual(this.memo, val) === false) {
        this.memo = val
        this.$emit('change', val)
      }
    },

    next ({ clientX = 0, clientY = 0 } = {}) {
      const { direction, adjust } = this
      const rect = this.$el.getBoundingClientRect()

      const { left, width } = rect
      const deltaX = clientX - left
      const x = adjust(deltaX / width)

      if (direction === 'h') {
        return this.notify(x)
      }
  
      const { top, height } = rect
      const deltaY = clientY - top
      const y = adjust(deltaY / height)

      if (direction === 'v') {
        return this.notify(y)
      }

      // both direction
      this.notify([x, y])
    },

    adjust (num) {
      return toPrecision(clamp(num, 0, 1), this.precision)
    }
  },

  render (h) {
    return this.$slots.default[0]
  },

  created () {
    const { msdown, msmove } = this

    this.msdown = msdown.bind(this)
    this.msmove = throttle(msmove.bind(this), this.throttle)

    this.memo = null
  },

  mounted () {
    this.$el.addEventListener('mousedown', this.msdown)
  },

  destroyed () {
    this.$el.removeEventListener('mousedown', this.msdown)
  },

  install () {
    Vue.component(VueCtrlComponent.name, VueCtrlComponent)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueCtrlComponent)
}

export default { VueCtrlComponent }
