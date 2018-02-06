// used to join local plugin paths with root path
var join = require('path').join

// used to flatten array of plugins provided which allows
// including chunks of plugins required from elsewhere as arrays.
var flatten = require('@flatten/array')

// export a default @use/it instance with no options.
module.exports = withOptions(null)

// export this so users can construct their own instance with custom options.
module.exports.withOptions = withOptions

// builds a @use/it instance with default options object.
function withOptions(defaults) {

  // closure for a @use/it instance with provided `defaults`.
  // `plugin` is a string (path or package name), function, or an array of either.
  // `options` is an object.
  // `root` is the location (__dirname) of the script calling use()
  // allowing us to determine the correct path for require()'ing
  // a local plugin path.
  return function use(plugin, options, root) {

    // this holds the combined options/defaults.
    var opts

    // if we received an array then flatten it and call ourself on each.
    if (Array.isArray(plugin)) {

      plugin = flatten([plugin])

      for (var el of plugin) {
        this.use(el, options, root)
      }

      // return because we called this function on each array element.
      return
    }

    // if there are `options` then try to combine them with `defaults`
    // or create a copy of it.
    if (options) {
      if (defaults) {
        opts = Object.assign({}, defaults, options)
      }

      else {
        opts = Object.create(options)
      }
    }

    // otherwise, copy the defaults (which may be null).
    else {
      opts = Object.create(defaults)
    }

    // if the plugin is a package name or path to a file then we require() it.
    if (typeof(plugin) === 'string') {

      // if it starts with a dot and there's a `root` then join them
      if (plugin[0] === '.' && root) {
        plugin = join(root, plugin)
      }

      // now try to require the plugin function and call it with this @use/it
      // instance and the options (`opts`).
      try {
        // also, return the result which may contain an error result.
        return require(plugin).call(this, opts, this)
      } catch(error) {
        return {error: 'failed to require and call plugin', plugin: plugin, opts: opts}
      }
    }

    // otherwise, if it's a function then skip the require() and call it.
    else if (typeof(plugin) === 'function') {
      return plugin.call(this, opts, this)
    }

    // lastly, we didn't get a string or function so return an error.
    else {
      return { error: 'plugin must be string, function, or array', plugin: plugin }
    }
  }
}
