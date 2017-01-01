'use strict'

import File from '../../src/File'
import { assert } from 'chai'

describe('File', function () {
  it('should be able to instantiate a file instance', function () {
    const file = new File({
      upload: {}
    })
    assert.instanceOf(file, File)
  })

  it('should set instance properties from file properties', function () {
    const file = new File({
      status: 'queued',
      name: 'foo.jpg',
      width: 0,
      height: 0,
      type: 'image/jpeg',
      size: 10,
      upload: {}
    })
    assert.equal(file.status, 'queued')
    assert.equal(file.name, 'foo.jpg')
    assert.equal(file.width, 0)
    assert.equal(file.height, 0)
    assert.equal(file.type, 'image/jpeg')
    assert.equal(file.size, 10)
  })

  it('should be able to update file status', function () {
    const file = new File({
      status: 'queued',
      upload: {}
    })
    assert.equal(file.status, 'queued')
    file.updateStatus('success')
    assert.equal(file.status, 'success')
  })

  it('should be able to update file progress', function () {
    const file = new File({
      status: 'queued',
      upload: {}
    })
    file.updateProgress(10)
    assert.equal(file.progress, 10)
  })

  it('should be able to update bytesSent', function () {
    const file = new File({
      status: 'queued',
      upload: {}
    })
    file.updateBytesSent(10)
    assert.equal(file.bytesSent, 10)
  })

  it('should be able to update xhrResponse', function () {
    const file = new File({
      status: 'queued',
      upload: {}
    })
    file.updateXhrResponse({
      responseText: 'foo'
    })
    assert.equal(file.xhrResponse.responseText, 'foo')
  })

  it('should be able to update error message', function () {
    const file = new File({
      status: 'queued',
      upload: {}
    })
    file.updateErrorMessage('There was an error')
    assert.equal(file.errorMessage, 'There was an error')
  })
})
