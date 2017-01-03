'use strict'

import Vue from 'vue'
import { assert } from 'chai'
import Clip from '../../src/components/Clip/index'
import Uploader from '../../src/Uploader'

describe('Clip', function () {
  before(function () {
    Vue.component('vue-clip', Clip)
    this.Component = Vue.component('vue-clip')
  })

  it('should have uploader property on the data object', function () {
    assert.isNull(Clip.data().uploader)
  })

  it('should have files property on the data object', function () {
    assert.deepEqual(Clip.data().files, [])
  })

  it('should have dragCounter property on the data object', function () {
    assert.equal(Clip.data().dragCounter, 0)
  })

  it('should instantiate uploader when component is mounted', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    assert.instanceOf(component.uploader, Uploader)
  })

  it('should set uploader preview template to component preview template element', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    assert.equal(
      component.uploader._options.previewTemplate,
      component.$refs['clip-preview-template'].innerHTML
    )
  })

  it('should set maxFiles property on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          maxFiles: 2
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.maxFiles, 2)
  })

  it('should set maxFiles property and dictMaxFilesExceeded message on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          maxFiles: {
            limit: 2,
            message: 'Sorry too many files!'
          }
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.maxFiles, 2)
    assert.equal(component.uploader._options.dictMaxFilesExceeded, 'Sorry too many files!')
  })

  it('should set maxFilesize property on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          maxFilesize: 4
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.maxFilesize, 4)
  })

  it('should set maxFilesize property and dictFileTooBig message on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          maxFilesize: {
            limit: 4,
            message: 'File is too big'
          }
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.maxFilesize, 4)
    assert.equal(component.uploader._options.dictFileTooBig, 'File is too big')
  })

  it('should set acceptedFiles property on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          acceptedFiles: ['image/*', 'application/pdf']
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.acceptedFiles, 'image/*,application/pdf')
  })

  it('should set acceptedFiles property and dictInvalidFileType message on options object when defined', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload',
          acceptedFiles: {
            extensions: ['image/*', 'application/pdf'],
            message: 'That is a different file type'
          }
        }
      }
    })
    component.$mount()
    assert.equal(component.uploader._options.acceptedFiles, 'image/*,application/pdf')
    assert.equal(component.uploader._options.dictInvalidFileType, 'That is a different file type')
  })

  it('should assign file a blobId when file has been added', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    const file = {
      name: 'foo.jpg',
      upload: {}
    }
    component.addedFile(file)
    assert.isDefined(file.blobId)
  })

  it('should push newly added file to the list of files', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    const file = {
      name: 'foo.jpg',
      upload: {}
    }
    component.addedFile(file)
    assert.deepEqual(component.files[0]._file, file)
  })

  it('should set file status to removed and call onRemovedFile prop when file is removed', function () {
    let onRemovedFileCalled = false
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        },
        onRemovedFile: function () {
          onRemovedFileCalled = true
        }
      }
    })
    component.$mount()
    const file = {
      name: 'foo.jpg',
      upload: {}
    }
    component.addedFile(file)
    component.removedFile(file)
    assert.equal(component.files[0].status, 'removed')
    assert.equal(onRemovedFileCalled, true)
  })

  it('should update the file status when complete event is received', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    const file = {
      name: 'foo.jpg',
      upload: {}
    }
    component.addedFile(file)
    component.complete({blobId: file.blobId, status: 'success'})
    assert.equal(component.files[0].status, 'success')
  })

  it('should update the file status and errorMessage when error event is received', function () {
    const component = new this.Component({
      propsData: {
        options: {
          url: '/upload'
        }
      }
    })
    component.$mount()
    const file = {
      name: 'foo.jpg',
      upload: {}
    }
    component.addedFile(file)
    component.error({blobId: file.blobId, status: 'error'}, 'Something bad happened')
    assert.equal(component.files[0].status, 'error')
    assert.equal(component.files[0].errorMessage, 'Something bad happened')
  })
})
