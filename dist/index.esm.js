import throttle from 'lodash/throttle';
import clamp from 'lodash/clamp';
import isEqual from 'lodash/isEqual';

var toPrecision = function (num, precision) {
  var p = precision | 0;
  return p > 0 ? parseFloat(num.toFixed(p)) : num
};

var VueCtrlComponent = {
  name: 'v-ctrl',
  abstract: true,
  props: {
    direction: {
      type: String,
      default: 'h',
      validator: function validator (val) {
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
    msdown: function msdown (e) {
      e.preventDefault();
      document.addEventListener('mousemove', this.msmove);
      document.addEventListener('mouseup', this.msup);
      this.next(e);
    },
  
    msmove: function msmove (e) {
      e.preventDefault();
      this.next(e);
    },
  
    msup: function msup (e) {
      this.next(e);
      document.removeEventListener('mousemove', this.msmove);
      document.removeEventListener('mouseup', this.msup);
    },
  
    notify: function notify (val) {
      if (isEqual(this.memo, val) === false) {
        this.memo = val;
        this.$emit('change', val);
      }
    },

    next: function next (ref) {
      if ( ref === void 0 ) ref = {};
      var clientX = ref.clientX; if ( clientX === void 0 ) clientX = 0;
      var clientY = ref.clientY; if ( clientY === void 0 ) clientY = 0;

      var ref$1 = this;
      var direction = ref$1.direction;
      var adjust = ref$1.adjust;
      var rect = this.$el.getBoundingClientRect();

      var left = rect.left;
      var width = rect.width;
      var deltaX = clientX - left;
      var x = adjust(deltaX / width);

      if (direction === 'h') {
        return this.notify(x)
      }
  
      var top = rect.top;
      var height = rect.height;
      var deltaY = clientY - top;
      var y = adjust(deltaY / height);

      if (direction === 'v') {
        return this.notify(y)
      }

      // both direction
      this.notify([x, y]);
    },

    adjust: function adjust (num) {
      return toPrecision(clamp(num, 0, 1), this.precision)
    }
  },

  render: function render (h) {
    return this.$slots.default[0]
  },

  created: function created () {
    var ref = this;
    var msdown = ref.msdown;
    var msmove = ref.msmove;

    this.msdown = msdown.bind(this);
    this.msmove = throttle(msmove.bind(this), this.throttle);

    this.memo = null;
  },

  mounted: function mounted () {
    this.$el.addEventListener('mousedown', this.msdown);
  },

  destroyed: function destroyed () {
    this.$el.removeEventListener('mousedown', this.msdown);
  },

  install: function install () {
    Vue.component(VueCtrlComponent.name, VueCtrlComponent);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueCtrlComponent);
}

var index = { VueCtrlComponent: VueCtrlComponent }

export default index;
//# sourceMappingURL=index.esm.js.map
