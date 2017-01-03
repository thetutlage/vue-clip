'use strict'

import Uploader from '../../src/Uploader'
import Dropzone from 'dropzone'
import { assert } from 'chai'

function getUploaderElem () {
  const uploaderElem = document.createElement('div')
  document.querySelector('body').appendChild(uploaderElem)
  return uploaderElem
}

describe('Uploader', function () {
  beforeEach(function () {
    document.querySelector('body').innerHTML = ''
  })

  it('should throw exception when calling mount method without dom element', function () {
    try {
      const uploader = new Uploader()
      uploader.mount()
      assert.notExists(uploader._uploader)
    } catch (e) {
      assert.equal(e.message, 'Invalid dropzone element.')
    }
  })

  it('should throw exception exception when calling mount without upload url', function () {
    try {
      const uploader = new Uploader({})
      uploader.mount(getUploaderElem())
      assert.notExists(uploader._uploader)
    } catch (e) {
      assert.equal(e.message, 'No URL provided.')
    }
  })

  it('should initate the dropzone instance', function () {
    const uploader = new Uploader({
      url: '/upload'
    })
    uploader.mount(getUploaderElem())
    assert.instanceOf(uploader, Uploader)
    assert.instanceOf(uploader._uploader, Dropzone)
  })

  it('should call the init method when uploader is mounted', function () {
    let initCalled = false
    const uploader = new Uploader({
      url: '/upload',
      init: function () {
        initCalled = true
      }
    })
    uploader.mount(getUploaderElem())
    assert.equal(initCalled, true)
  })

  it('should bind hooks to the dropzone events', function () {
    let addedFile = function () {}
    const uploader = new Uploader({
      url: '/upload'
    })
    uploader.on('addedfile', addedFile)
    uploader.mount(getUploaderElem())
    assert.deepEqual(uploader._uploader._callbacks.addedfile[1], addedFile)
  })

  it('should clear hooks internal array when hooks have been binded', function () {
    let addedFile = function () {}
    const uploader = new Uploader({
      url: '/upload'
    })
    uploader.on('addedfile', addedFile)
    uploader.mount(getUploaderElem())
    assert.deepEqual(uploader._uploader._callbacks.addedfile[1], addedFile)
    assert.deepEqual(uploader._hooks, [])
  })

  it('should clear all hooks on cleaning up the uploader instance', function () {
    const uploader = new Uploader({
      url: '/upload'
    })
    uploader.on('addedfile', function () {})
    uploader.mount(getUploaderElem())
    uploader.destroy()
    setTimeout(function () {
      assert.deepEqual(uploader._uploader._callbacks.addedfile, [])
    })
  })

  it('should remove dropzone property from domElem on calling destroy', function () {
    const domElem = getUploaderElem()
    const uploader = new Uploader({
      url: '/upload'
    })
    uploader.on('addedfile', function () {})
    uploader.mount(domElem)
    assert.isDefined(domElem.dropzone)
    uploader.destroy()
    setTimeout(function () {
      assert.deepEqual(uploader._uploader._callbacks.addedfile, [])
      assert.equal(domElem.dropzone, undefined)
    })
  })
})
