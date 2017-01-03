'use strict'

class File {

  constructor (file) {
    this._file = file
    this.status = file.status
    this.name = file.name
    this.width = file.width
    this.height = file.height
    this.bytesSent = file.upload.bytesSent || 0
    this.progress = file.upload.progress || 0
    this.total = file.upload.total
    this.type = file.type
    this.size = file.size
    this.dataUrl = ''
    this.xhrResponse = {}
    this.customAttributes = {}
    this.errorMessage = ''
  }

  updateDataUrl (dataUrl) {
    this.dataUrl = dataUrl
  }

  updateStatus (status) {
    this.status = status
  }

  updateProgress (progress) {
    this.progress = progress
  }

  updateBytesSent (bytesSent) {
    this.bytesSent = bytesSent
  }

  updateXhrResponse (response) {
    this.xhrResponse = response
  }

  updateErrorMessage (errorMessage) {
    this.errorMessage = errorMessage
  }

  addAttribute (key, value) {
    this.customAttributes[key] = value
  }

}

export default File
