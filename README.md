# @use/it
[![Build Status](https://travis-ci.org/elidoran/node-use-it.svg?branch=master)](https://travis-ci.org/elidoran/node-use-it)
[![Dependency Status](https://gemnasium.com/elidoran/node-use-it.png)](https://gemnasium.com/elidoran/node-use-it)
[![npm version](https://badge.fury.io/js/%40use%2Fit.svg)](http://badge.fury.io/js/%40use%2Fit)
[![Coverage Status](https://coveralls.io/repos/github/elidoran/node-use-it/badge.svg?branch=master)](https://coveralls.io/github/elidoran/node-use-it?branch=master)

Simple use() function for easy plugin ability.

Allows default options and plugin specific options.

Accepts module name or path to `use()` and will `require()` it for you.

Can assign it to any name.


# Table of Contents

1. [Install](#install)
2. [Applying use](#usage-applying-use)
3. [Example Plugin](#usage-example-plugin)
4. [Example](#usage-example)
5. [Specify Default Options](#usage-specify-default-options)
6. [Specify Plugin Options](#usage-specify-plugin-options)


## Install

```sh
npm install --save @use/it
```


## Usage: Applying 'use'

The simplest way to use this module is to `require()` it and assign it to the `use` property on your object.

You may use any property name, like, 'load', 'add', 'plugin', or 'enhance'.

Use it by supplying something which can be given to `require()` to get a function, or, supply a function.

```javascript
// your thing can be anything we can set `use` on
var thing = getThing()

// get this module which and set it as use().
// or, you can name it anything you want.
thing.use = require('@use/it')

var somePluginName = 'some-name'
var pluginRequired = require('another-plugin')
var pluginFunction = function() { }
var someOptions = {}

// add those plugins to your `thing`:
//  Note: options are optional

// 1. provide a module name or file path for `require()`
thing.use(somePluginName, someOptions)

// 2. provide the module directly when you've already loaded it
thing.use(pluginRequired, { /* with some other options */ })

// 3. provide a function directly as a plugin
thing.use(pluginFunction /* without options */)


// also, you can specify multiple plugins in an array.
// new copy of provided options for each one.
thing.use([
  'some-package',
  './some-module',
  function direct(options) {},
  [
    // an inner array which could have been provided
    // from another package...
  ]
], { shared: 'options' }, __dirname)
```


## Usage: Example Plugin

```javascript
function plugin(options, thing) {
  // `this` is the `thing`, same as param #2.
  // so, these two lines do the same thing:
  this.blah  = 'example'
  thing.blah = 'example'

  // `options` is the combined options provided to:
  //   1. `thing.use = use.withOptions(defaultOptions)`
  //   2. `thing.use(fn, pluginOptions)`
  // #2 overrides #1.
  // options may be null.
}
```


## Usage: Example

```javascript
// example `thing` is a behaviorless object
var thing = {}

// add this module so plugins can be applied
thing.use = require('@use/it')

// add a function directly as a plugin.
// it adds a function to the `thing`
thing.use(function addProcess() {
  // `this` is the `thing`
  this.process = function process(string) {
    console.log('I am processing string:', string)
  }
})

// now the `thing` has some added ability.
// the below call will output to the console:
//   I am processing string: blah
thing.process('blah')

// add another function which will alter process()
thing.use(function wrapInput(options) {
  var realProcess = this.process
  var prefix = '['
  var suffix = ']'

  if (options) {
    if (options.prefix) prefix = options.prefix
    if (options.suffix) suffix = options.suffix
  }

  this.process = function wrappedProcess(string) {
    string = prefix + string + suffix
    return realProcess.call(this, string)
  }
})

// now `process()` wraps the string with brackets instead
// the below call will output to the console:
//   I am processing string: [bleh]
thing.process('bleh')
```


## Usage: Specify Default Options

```javascript
// as above, let's use a behaviorless object
var use = require('@use/it')
var thing = {}

// instead of adding the default `use()` function, let's supply options.
thing.use = use.withOptions({
  // these will be used by `wrapInput`
  prefix: '(',
  suffix: ')'
})

// same as the functions made above
thing.use(addProcess)
thing.use(wrapInput)

thing.process('blarg')
// The `wrapInput` will receive the options we made
// and then use parenthesis instead of brackets.
// the above outputs this to the console:
//    I am processing string: (blarg)
```


## Usage: Specify Plugin Options

```javascript
// as above, let's use a behaviorless object
var use = require('@use/it')
var thing = {}

// instead of adding the default `use()` function, let's supply options.
thing.use = use.withOptions({
  // these will be overridden by plugin specific options
  prefix: '(',
  suffix: ')'
})

// same as the functions made above
thing.use(addProcess)
// these plugin specific options will override default options
thing.use(wrapInput, {
  prefix: '\'',
  suffix: '\''
})

thing.process('bling')
// The `wrapInput` will receive options combined from the default
// options provided for the `use()` function
// and the plugin specific options provided to the `use()` call,
// So, it will use single quotes instead of brackets or parenthesis.
// the above outputs this to the console:
//    I am processing string: 'bling'
```


## [MIT License](LICENSE)
