'use strict'

import Clip from './src/components/Clip/index.js'

const VueClip = {
  install (Vue) {
    Vue.component('vue-clip', Clip)
  }
}

/**
 * When required globally
 */
if (typeof (window) !== 'undefined' && typeof (window.Vue) !== 'undefined') {
  window.Vue.use(VueClip)
}

export default VueClip
