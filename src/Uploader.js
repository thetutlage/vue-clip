'use strict'

import Dropzone from 'dropzone'

Dropzone.autoDiscover = false

class Uploader {

  constructor (options) {
    this._options = options || {}
    this._existingInit = this._options.init || function () {}
    this._hooks = []
    this._uploader = null
  }

  /**
   * Bind hooks to the uploader instance. Also
   * makes sure to call the options init if
   * defined.
   *
   * @private
   */
  _bindHooks (self) {
    self._existingInit.bind(this)()
    self._hooks.forEach((hook) => {
      this.on(hook.event, hook.callback)
    })
    self._hooks = []
  }

  /**
   * Mounts uploader to the DOM
   *
   * @param  {DOMElement} domElem
   */
  mount (domElem) {
    const self = this
    this._options.init = function () {
      self._bindHooks.bind(this)(self)
    }
    this._uploader = new Dropzone(domElem, this._options)
  }

  /**
   * Binds a hook listener
   *
   * @param  {String}   event
   * @param  {Function} callback
   */
  on (event, callback) {
    this._hooks.push({ event, callback })
  }

  /**
   * Removes all listeners and dom bindings.
   */
  destroy () {
    this._uploader.disable()
  }

  /**
   * Remove file from the uploader
   *
   * @param  {Object} file
   */
  removeFile (file) {
    this._uploader.removeFile(file)
  }

  /**
   * Add native file object to dropzone
   *
   * @param {Object} file
   */
  addFile (file) {
    this._uploader.addFile(file)
  }

  /**
   * Remove all files
   *
   * @param  {Boolean} [cancelQueued]
   */
  removeAllFiles (cancelQueued) {
    this._uploader.removeAllFiles(cancelQueued)
  }

}

export default Uploader
