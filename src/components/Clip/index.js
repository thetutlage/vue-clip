'use strict'

/*
 * vue-clip
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import Uploader from '../../Uploader'
import File from '../../File'
import clone from 'lodash.clone'
import SymbolFallback from 'babel-runtime/core-js/symbol'

const component = {}

component.template = `<div v-bind:class="uploaderClass">
  <slot name="clip-uploader-action" :dragging="dragCounter > 0"></slot>
  <slot name="clip-uploader-body" :files="files"></slot>
  <div ref="clip-preview-template" class="clip-preview-template" style="display: none;"><div></div></div>
</div>`

// DEFINING PROPS
component.props = {}

/**
 * css class to be placed on action button parent div.
 * clip component sets its display to inline-block,
 * which may cause issues and this class can be
 * used to override it's styles.
 *
 * @type {Object}
 */
component.props.uploaderClass = {
  type: String
}

/**
 * Uploader options, majority of options
 * are based of dropzone. Check docs
 * for more insights.
 *
 * @type {Object}
 */
component.props.options = {
  type: Object,
  default: function () {
    return {}
  }
}

component.props.onAddedFile = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onRemovedFile = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onSending = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onDragEnter = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onDragLeave = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onDrop = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onTotalProgress = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onQueueComplete = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onMaxFiles = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onInit = {
  type: Function,
  default: function () {
    return function () {}
  }
}

component.props.onComplete = {
  type: Function,
  default: function () {
    return function () {}
  }
}

// COMPONENT DATA
component.data = function () {
  return {
    files: [],
    dragCounter: 0,
    uploader: null
  }
}

// LIFECYCLE HOOKS
component.mounted = function () {
  const options = clone(this.options)
  const accept = options.accept || function (file, done) { done() }

  /**
   * Overriding properties of the options object
   */
  options.previewTemplate = this.$refs['clip-preview-template'].innerHTML
  options.accept = ({ blobId }, done) => {
    accept(this.getFile(blobId), done)
  }

  if (typeof (options.maxFiles) !== 'undefined' && options.maxFiles instanceof Object === true) {
    const {limit, message} = options.maxFiles
    options.maxFiles = limit
    options.dictMaxFilesExceeded = message
  }

  if (typeof (options.maxFilesize) !== 'undefined' && options.maxFilesize instanceof Object === true) {
    const {limit, message} = options.maxFilesize
    options.maxFilesize = limit
    options.dictFileTooBig = message
  }

  if (typeof (options.acceptedFiles) !== 'undefined' &&
    options.acceptedFiles instanceof Object === true &&
    options.acceptedFiles instanceof Array === false) {
    const {extensions, message} = options.acceptedFiles
    options.acceptedFiles = extensions.join(',')
    options.dictInvalidFileType = message
  }

  /**
   * Instantiating uploader
   */
  this.uploader = new Uploader(options)
  this.bindEvents()
  this.uploader.mount(this.$el.firstElementChild)
  this.onInit(this)
}

// DEFINING METHODS
component.methods = {}

/**
 * Listening for uploader events.
 *
 * @param  {Object}
 */
component.methods.bindEvents = function () {
  this.uploader.on('addedfile', this.addedFile.bind(this))
  this.uploader.on('removedfile', this.removedFile.bind(this))
  this.uploader.on('sending', this.sending.bind(this))
  this.uploader.on('complete', this.complete.bind(this))
  this.uploader.on('error', this.error.bind(this))
  this.uploader.on('uploadprogress', this.uploadProgress.bind(this))
  this.uploader.on('thumbnail', this.thumbnail.bind(this))
  this.uploader.on('drop', this.drop.bind(this))
  this.uploader.on('dragenter', this.dragEnter.bind(this))
  this.uploader.on('dragleave', this.dragLeave.bind(this))
  this.uploader.on('totaluploadprogress', this.totalUploadProgress.bind(this))
  this.uploader.on('maxfilesexceeded', this.maxFilesExceeded.bind(this))
  this.uploader.on('queuecomplete', this.queueComplete.bind(this))
}

/**
 * Returns file instance of a unique file id or
 * an empty object
 *
 * @param  {Symbol} blobId
 *
 * @return {Object}
 */
component.methods.getFile = function (blobId) {
  let matchedFile = {}
  this.files.forEach((file) => {
    if (file._file.blobId === blobId) {
      matchedFile = file
    }
  })
  return matchedFile
}

/**
 * Adds file to the list of local files object
 * with a unique symbol key. Same is required
 * for update the file object to keep it
 * reactive.
 *
 * Also invokes the onAddedFile prop.
 *
 * @param  {Object} file
 */
component.methods.addedFile = function (file) {
  const fileId = SymbolFallback()
  file.blobId = fileId
  this.files.push(new File(file))
  this.onAddedFile(this.getFile(fileId))
}

/**
 * Removes the file from the files list and invokes
 * the onRemovedFile prop
 *
 * @param  {Symbol} options.blobId
 */
component.methods.removedFile = function ({ blobId }) {
  const fileInstance = this.getFile(blobId)
  fileInstance.updateStatus('removed')
  this.onRemovedFile(fileInstance)
}

/**
 * Listens for sending event and calls onSending
 * prop
 *
 * @param  {Symbol} options.blobId
 * @param  {Object} xhr
 * @param  {Object} formData
 */
component.methods.sending = function ({ blobId }, xhr, formData) {
  const fileInstance = this.getFile(blobId)
  this.onSending(fileInstance, xhr, formData)
}

/**
 * Updates the file status on completion
 *
 * @param  {Symbol} options.blobId
 * @param  {String} options.status
 */
component.methods.complete = function ({ blobId, status, xhr = {} }) {
  const fileInstance = this.getFile(blobId)
  fileInstance.updateStatus(status)
  fileInstance.updateXhrResponse({
    response: xhr.response,
    responseText: xhr.responseText,
    statusCode: xhr.status
  })
  this.onComplete(fileInstance, status, xhr)
}

/**
 * Update the file error message to be used for
 * displaying the error
 *
 * @param  {Symbol} options.blobId
 * @param  {String} options.status
 * @param  {String} errorMessage
 */
component.methods.error = function ({ blobId, status }, errorMessage) {
  const fileInstance = this.getFile(blobId)
  fileInstance.updateStatus(status)
  fileInstance.updateErrorMessage(errorMessage)
}

/**
 * Updates file progress and bytes sent
 *
 * @param  {Symbol} options.blobId
 * @param  {Number} progress
 * @param  {Number} bytesSent
 */
component.methods.uploadProgress = function ({ blobId }, progress, bytesSent) {
  const fileInstance = this.getFile(blobId)
  fileInstance.updateProgress(progress)
  fileInstance.updateBytesSent(bytesSent)
}

/**
 * Updates file thumbnail, only in case of image uploads
 *
 * @param  {Symbol} options.blobId
 * @param  {String} dataUrl
 */
component.methods.thumbnail = function ({ blobId }, dataUrl) {
  const fileInstance = this.getFile(blobId)
  fileInstance.updateDataUrl(dataUrl)
}

/**
 * Listen for drop event and call onDrop
 * and onDragLeave prop.
 */
component.methods.drop = function () {
  this.dragCounter = 0
  this.onDrop()
  this.onDragLeave()
}

/**
 * Listen for dragenter event and call onDragEnter
 * prop. Also increment the drag counter, required
 * for handling browser flickering issues.
 *
 * @param  {Object} event
 */
component.methods.dragEnter = function (event) {
  event.preventDefault()
  this.dragCounter++
  this.onDragEnter()
}

/**
 * Listen for dragleave event and call onDragLeave
 * prop. Also decrement the drag counter, required
 * for handling browser flickering issues.
 */
component.methods.dragLeave = function () {
  this.dragCounter--
  if (this.dragCounter === 0) {
    this.onDragLeave()
  }
}

/**
 * Listen for totaluploadprogress event and call
 * onTotalProgress prop.
 *
 * @param  {Spread} args
 */
component.methods.totalUploadProgress = function (...args) {
  this.onTotalProgress(...args)
}

/**
 * Listen for queuecomplete event and call
 * onQueueComplete prop.
 *
 */
component.methods.queueComplete = function () {
  this.onQueueComplete()
}

/**
 * Listen for maxfilesreached event and call
 * onMaxFiles prop.
 *
 * @param {Symbol} blobId
 *
 */
component.methods.maxFilesExceeded = function ({ blobId }) {
  const fileInstance = this.getFile(blobId)
  this.onMaxFiles(fileInstance)
}

/**
 * Removes file from the uploader. This file will
 * not receive any more events.
 *
 * @param  {Object} file
 */
component.methods.removeFile = function (file) {
  this.uploader.removeFile(file._file)
}

/**
 * Add a native file object directly to dropzone.
 *
 * @param {Object} file
 */
component.methods.addFile = function (file) {
  this.uploader.addFile(file)
}

/**
 * Remove all files.
 *
 * @param  {Boolean} cancelQueued
 */
component.methods.removeAllFiles = function (cancelQueued) {
  this.uploader.removeAllFiles(cancelQueued)
}

export default component
