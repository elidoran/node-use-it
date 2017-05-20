assert = require 'assert'
corepath = require 'path'
equal = require 'deep-eql'

use = require '../../lib'

describe 'test use', ->

  it 'should return an error for unknown module', ->

    thing = {}
    thing.use = use
    result = thing.use 'unknown-module-name'
    assert result?.error

  it 'should return an error for non-existent path', ->

    thing = {}
    thing.use = use
    result = thing.use '/does/not/exist'
    assert result?.error

  it 'should return an error for a non-function', ->

    thing = {}
    thing.use = use
    result = thing.use new Date # not a string or function
    assert result?.error

  it 'should alter thing', ->

    thing = {}
    thing.use = use
    thing.use -> @prop = 'test'
    assert.equal thing.prop, 'test'

  it 'should alter thing using default options', ->

    defaultOptions = prop:'test1'
    receivedOptions = null
    thing = {}
    thing.use = use.withOptions defaultOptions
    thing.use (options) ->
      receivedOptions = options
      @[options.prop] = 'test2'
    assert.equal receivedOptions.prop, defaultOptions.prop
    assert.equal thing.test1, 'test2'

  it 'should alter thing using plugin options', ->

    thing = {}
    thing.use = use
    thing.use ((options) -> @[options.prop] = 'test'), prop:'plugin'
    assert.equal thing.plugin, 'test'

  it 'should alter thing using plugin options overriding default options', ->

    thing = {}
    thing.use = use.withOptions prop:'test'
    thing.use ((options) -> @[options.prop] = 'test'), prop:'plugin'
    assert.equal thing.plugin, 'test'

  it 'should process array as multiple plugins', ->

    options = some: 'options'
    called = false
    calledOptions = null
    array = [
      '../helpers/plugin.coffee'
      (options) -> called = true ; calledOptions = options
      '../helpers/plugin2.coffee'
    ]
    thing = {}
    thing.use = use
    result = thing.use array, options, __dirname
    assert.equal result?.error, null
    assert called
    assert.equal calledOptions.some, options.some
    # NOTE: assert.deepEqual fails here ... so, use a real equal test.
    assert equal calledOptions, options
