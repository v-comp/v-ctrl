import throttle from 'lodash/throttle';

var clamp = function (value, min, max) {
  return Math.max(min, Math.min(value, max))  
};

var vCtrlComponent = {
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
    onMousedown: function onMousedown (e) {
      e.preventDefault();
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      this.updateValue(e);
    },
  
    onMouseMove: function onMouseMove (e) {
      e.preventDefault();
      this.updateValue(e);
    },
  
    onMouseUp: function onMouseUp (e) {
      this.updateValue(e);
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    },
  
    updateValue: function updateValue (ref) {
      if ( ref === void 0 ) ref = {};
      var clientX = ref.clientX; if ( clientX === void 0 ) clientX = 0;
      var clientY = ref.clientY; if ( clientY === void 0 ) clientY = 0;

      var rect = this.$el.getBoundingClientRect();
      var left = rect.left;
      var top = rect.top;
      var width = rect.width;
      var height = rect.height;

      var deltaX = clientX - left;
      var deltaY = clientY - top;

      var x = clamp(deltaX / width, 0, 1);
      var y = clamp(deltaY / height, 0, 1);

      var dir = this.direction;
      // eslint-disable-next-line
      var data = dir === 'vh' ? { x: x, y: y } : (dir === 'v' ? y : x);

      this.$emit('change', data);
    }
  },

  render: function render (h) {
    return this.$slots.default[0]
  },

  created: function created () {
    var ref = this;
    var direction = ref.direction;
    var onMousedown = ref.onMousedown;
    var onMouseMove = ref.onMouseMove;

    if (direction === 'hv') {
      this.direction = 'vh';
    }

    this.onMousedown = onMousedown.bind(this);
    this.onMouseMove = throttle(onMouseMove.bind(this), this.throttle);
  },

  mounted: function mounted () {
    this.$el.addEventListener('mousedown', this.onMousedown);
  },

  destroyed: function destroyed () {
    this.$el.removeEventListener('mousedown', this.onMousedown);
  },

  install: function install () {
    Vue.component(vCtrlComponent.name, vCtrlComponent);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(vCtrlComponent);
}

var index = { vCtrlComponent: vCtrlComponent };

export default index;
//# sourceMappingURL=index.esm.js.map
