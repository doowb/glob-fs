'use strict';

var utils = require('./utils');

module.exports = function (app) {
  app.visit('mixin', {

    /**
     * Asynchronously glob files or directories that match
     * the given `pattern`.
     *
     * ```js
     * var glob = require('glob-fs')({ gitignore: true });
     *
     * glob.readdir('*.js', function (err, files) {
     *   //=> do stuff with `files`
     * });
     * ```
     *
     * @name .readdir
     * @param  {String} `pattern` Glob pattern
     * @param  {Object} `options`
     * @param  {Function} `cb` Callback
     * @api public
     */

    readdir: function(pattern, options, cb) {
      if (typeof options === 'function') {
        return this.readdir(pattern, {}, options);
      }

      this.setPattern(pattern, options);
      this.iteratorAsync(this.pattern.base, function (err) {
        if (err) return cb(err);

        cb.call(this, null, this.files);
      }.bind(this));
      return this;
    },

    /**
     * Synchronously glob files or directories that match
     * the given `pattern`.
     *
     * ```js
     * var glob = require('glob-fs')({ gitignore: true });
     *
     * var files = glob.readdirSync('*.js');
     * //=> do stuff with `files`
     * ```
     *
     * @name .readdirSync
     * @param  {String} `pattern` Glob pattern
     * @param  {Object} `options`
     * @returns {Array} Returns an array of files.
     * @api public
     */

    readdirSync: function(pattern, options) {
      this.setPattern(pattern, options);
      this.iteratorSync(this.pattern.base);
      this.emit('end');
      return this.files;
    },

    /**
     * Stream files or directories that match the given glob `pattern`.
     *
     * ```js
     * var glob = require('glob-fs')({ gitignore: true });
     *
     * glob.readdirStream('*.js')
     *   .on('data', function (file) {
     *     console.log(file.path);
     *   })
     *   .on('error', console.error)
     *   .on('end', function () {
     *     console.log('end');
     *   });
     * ```
     *
     * @name .readdirStream
     * @param  {String} `pattern` Glob pattern
     * @param  {Object} `options`
     * @returns {Stream}
     * @api public
     */

    readdirStream: function(pattern, options) {
      this.setPattern(pattern, options);
      return this.iteratorStream(this.pattern.base);
    },

    readdirPromise: function(pattern, options) {
      this.setPattern(pattern, options);
      return this.iteratorPromise(this.pattern.base);
    }
  });
};
