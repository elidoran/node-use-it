var join = require('path').join
var flatten = require('@flatten/array')

module.exports = withOptions(null)
module.exports.withOptions = withOptions

function withOptions(defaults) {
  return function use(plugin, options, root) {
    var opts

    if (Array.isArray(plugin)) {
      plugin = flatten([plugin])
      for (var el of plugin) {
        this.use(el, options, root)
      }
      return
    }

    if (options) {
      if (defaults) {
        opts = Object.assign({}, defaults, options)
      }

      else {
        opts = Object.create(options)
      }
    }

    else {
      opts = Object.create(defaults)
    }

    if (typeof(plugin) === 'string') {
      if (plugin[0] === '.' && root) {
        plugin = join(root, plugin)
      }
      try {
        return require(plugin).call(this, opts, this)
      } catch(error) {
        return {error: 'failed to require and call plugin', plugin: plugin, opts: opts}
      }
    }

    else if (typeof(plugin) === 'function') {
      return plugin.call(this, opts, this)
    }

    else {
      return { error: 'plugin must be string, function, or array', plugin: plugin }
    }
  }
}
