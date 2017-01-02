## Introduction

Vue clip is a minimalistic and hackable file uploader for VueJs. I wrote this plugin due to the absence of well written file uploaders with fine-grained controls.

<p>
  <a href="https://www.npmjs.com/package/vue-clip"><img src="https://img.shields.io/npm/v/vue-clip.svg?style=flat-square" alt="Version"></a>
  <a href="https://travis-ci.org/thetutlage/vue-clip"><img src="https://img.shields.io/travis/thetutlage/vue-clip/master.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/vue-clip"><img src="https://img.shields.io/npm/dt/vue-clip.svg?style=flat-square" alt="Downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/vue-clip.svg?style=flat-square" alt="License"></a>
</p>

#### Features
1. Written in vanilla Javascript.
2. Weighs **17.9KB ( Minified and Gzip )**, **57KB ( Minified )**.
3. Hackable to the core with custom events.

## Setup
You can make use of module by installing it from `npm` or directly using it from CDN.

#### Npm

```bash
npm i --save vue-clip
```

```javascript
import Vue from 'vue'
import VueClip from 'vue-clip'

Vue.use(VueClip)
```

#### Globally

Also, you can reference the script file via [CDN]() which will add a global component called `vue-clip` to the Vue instance.

## Basic Usage

```html
<template>
  <vue-clip :options="options">
    <template slot="clip-uploader-action">
      <div>
        <div class="dz-message"><h2> Click or Drag and Drop files here upload </h2></div>
      </div>
    </template>

    <template slot="clip-uploader-body" scope="props">
      <div v-for="file in file.props">
        <img v-bind:src="file.dataUrl" />
        {{ file.name }} {{ file.status }}
      </div>
    </template>

  </vue-clip>
</template>

<script>
  export default {

    data () {
      return {
        options: {
          url: '/upload',
          paramName: 'file'
        }
      }
    }

  }
</script>
```

## Configuration Options

| Option | Possible Values | Description |
|--------|-----------------|-------------|
| url | String, Function | Url to be used for uploading files. This can be a string or a function ( in case your URL is dynamic ) |
| method | String, Function | Http method to be used. Defaults to `post`.
| parallelUploads | Number | Number of files to be uploaded in parallel.
| maxFilesize | Number, Object | The file size **in MB** to be allowed. Also, you can pass an object with `limit` and `error message`.|
| paramName | String | Param name to be used for uploading file(s). Defaults to `file`.|
| uploadMultiple | Boolean | Whether or not to upload multiple files.|
| headers | Object | Http headers to be sent along each request.|
| maxFiles | Number, Object | a maximum number of files to be uploaded. You can also pass an object with `limit` and `error message`.|
| acceptedFiles | Array, Object | File types to be accepted. `['image/*', 'application/pdf']`.
| accept | Function | A custom function to be used for validating each file upload. This method receives a `done` callback. In the case of any errors, you must call done with a single error argument.

#### maxFilesize
The `maxFilesize` option defines the size of the file to be checked for when uploading files.

```js
{
  maxFilesize: 1 // 1mb
}

// or

{
  maxFilesize: {
    limit: 1,
    message: '{{ filesize }} is greater than the {{ maxFilesize }}'
  }
}
```

#### maxFiles

The `maxFiles` option defines the maximum number of files to be uploaded.

```js
{
  maxFiles: 5
}

// or

{
  maxFiles: {
    limit: 5,
    message: 'You can only upload a max of 5 files'
  }
}
```

#### acceptedFiles

The mime types of files to be accepted.

```js
{
  acceptedFiles: ['image/*', 'application/pdf']
}

// or

{
  acceptedFiles: {
    extensions: ['image/*'],
    message: 'You are uploading an invalid file'
  }
}
```

#### accept

The `accept` is a low-level method to run manual validations and return a formatted error string ( in the case of error).

```js
{
  accept: function (file, done) {
    if (file.size > (1024 * 1024)) {
      done('File must be smaller than 1MB')
      return
    }

    done()
  }
}
```

## Dragging

The most common requirement is to know when a user `starts` and `stops` dragging a file so that you can add some visual feedback to the UI. The easiest way is to make use of [Scoped slots](https://vuejs.org/v2/guide/components.html#Scoped-Slots).

```html
<template>
  <vue-clip :options="options">

    <template slot="clip-uploader-action" scope="params">
      <div v-bind:class="{'is-dragging': params.dragging}" class="upload-action">
        <h2> Click or Drag and Drop files here upload </h2>
      </div>
    </template>

  </vue-clip>
</template>

<style>
  .upload-action.is-dragging {
    background: green;
  }
</style>
```

## Events

You can make use of `vue-clip` without writing any javascript code, but if you want low-level control over the upload behavior, consider listening to special events.

#### onInit(uploader)
Called every time the `vue-clip` is initiated and binds to DOM.

```html
<template>
  <vue-clip :on-init="init">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      init (uploader) {
        // javascript uploader instance
      }
    }

  }
</script>
```

#### onAddedFile(file)
This event is invoked every time a new file gets uploaded. You can listen for this event, you want to have access to each file object within your own parent component.

```html
<template>
  <vue-clip :on-added-file="addedFile">
  </vue-clip>
</template>

<script>
  export default {

    data: function () {
      return {
        files: []
      }
    }

    methods: {
      addedFile (file) {
        this.files.push(file)
      }
    }

  }
</script>
```

#### onRemovedFile(file)
This event is invoked every time the file has been removed. This is the nice place to make a request to your server for deleting the file.

```html
<template>
  <vue-clip :on-removed-file="removedFile">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      removedFile (file) {
        this
        .$http
        .post(`delete/${file.customAttributes.id}`)
        .then(console.log)
        .catch(console.error)
      }
    }

  }
</script>
```

#### onSending(file, XHR, formData)
This event is emitted before making the upload HTTP request. So this is the time to modify the HTTP request and send some custom attributes.

```html
<template>
  <vue-clip :on-sending="sending">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      sending (file, xhr, formData) {
        formData.append('_csrf', '<token>')
      }
    }

  }
</script>
```

#### onComplete(file, status, xhr)
This event is called when a file has been processed. It includes **error, success** both. `3rd argument` will be the xhr response, if the error is returned from the server when uploading the file.

```html
<template>
  <vue-clip :on-complete="complete">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      complete (file, status, xhr) {
        // Adding server id to be used for deleting
        // the file.
        file.addAttribute('id', xhr.response.id)
      }
    }

  }
</script>
```

#### onDragEnter
This event is invoked as soon as the user starts dragging the file.

```html
<template>
  <vue-clip :on-drag-enter="dragging">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      dragging () {
        // user started dragging the file.
      }
    }

  }
</script>
```

#### onDragLeave
This event is invoked when the user stops dragging the file.

```html
<template>
  <vue-clip :on-drag-leave="stoppedDragging">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      stoppedDragging () {
        // user stopped dragging the file.
      }
    }

  }
</script>
```

#### onDrop
This event is invoked when the user drops a file on the vue-clip area.

```html
<template>
  <vue-clip :on-drop="drop">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      drop () {
        // user stopped dragging the file.
      }
    }

  }
</script>
```

#### onTotalProgress(progress, totalBytes, bytesSent)
This event returns the total upload progress for all the files. Think of it as the global progress indicator for multiple files uploaded together.

```html
<template>
  <vue-clip :on-total-progress="totalProgress">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      totalProgress (progress, totalBytes, bytesSent) {
      }
    }

  }
</script>
```

#### onQueueComplete
The event is called when all files in the queue have been uploaded to the server.

```html
<template>
  <vue-clip :on-queue-complete="queueCompleted">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      queueCompleted () {
      }
    }

  }
</script>
```

#### onMaxFiles
The event is called when maxFiles upload limit has been reached. This event will be fired `n times`for each file exceeding the limit. For example

- **maxFiles** - 3
- **filesUploaded** - 5
- **eventCalled** - 2 times with file instance

```html
<template>
  <vue-clip :on-max-files="maxFilesReached">
  </vue-clip>
</template>

<script>
  export default {

    methods: {
      maxFilesReached (file) {
      }
    }

  }
</script>
```

## File Attributes
The file instance sent along events has following attributes.

| Attribute | Type | Description |
|-----------|------|-------------|
| name | String | The client name of the file |
| status String | String | The file status, which can be `success`, `error`, `queued`, `added`. |
| width | Number | The file width. Only for images. |
| height | Number | The file height. Only for images. |
| bytesSent | Number | The total bytes sent to the server so far. |
| progress | Number | Total upload progress. |
| total | Number | The total number of bytes to be sent to the server. |
| type | String | The file mime-type. |
| size | Number | The file size on user disk. |
| dataUrl | String | File base64 data URL to be used for displaying images preview. |
| xhrResponse | Object | Server xhrResponse. Only contains `response`, `responseText` and `statusCode` |
| errorMessage | String | Error message when processing a file. If the error is returned from the server, it will be the value of XHR error. Also can be client errors for `maxSize` etc.|
| customAttributes | Object | Each file needs some custom attributes, for example `server id` to  be used for deleting the files.|

#### Adding/Accessing Custom Attributes
```javascript
file.addAttribute('id', xhr.response.id)

// access id
file.customAttributes.id
```

## Browser Support

- Chrome 7+
- Firefox 4+
- IE 10+
- Opera 12+
- Safari 6+


#### Things to consider
Make sure you add class `dz-message` to the uploader action wrapped inside `clip-uploader-action` slot. This makes your entire action body clickable. There are ways to get around it, but I wanted to keep the API transparent, instead of adding a bunch of DOM elements behind the scenes.

```html
<template slot="clip-uploader-action">
  <div>
    <div class="dz-message"><h2> Click or Drag and Drop files here upload </h2></div>
  </div>
</template>
```

## Recipes

#### Tutorial

#### Displaying Files Out Of Vue Clip Area

#### Uploading Files Using A Custom File Input
