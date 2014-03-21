// Generated by CoffeeScript 1.6.1
var Deferred, ScssFile, file, fs, path, _;

fs = require('fs');

_ = require('underscore');

path = require('path');

Deferred = require('when');

ScssFile = (function() {

  ScssFile.prototype.importReg = new RegExp(/@import\s*"(.*?)"/g);

  function ScssFile(pathToFile, options) {
    var dir, promises, _base,
      _this = this;
    this.options = _.extend({
      encoding: 'utf-8'
    }, options);
    dir = path.dirname(pathToFile);
    this.deps = [];
    promises = [];
    if (!fs.existsSync(pathToFile)) {
      if (typeof (_base = this.options).callback === "function") {
        _base.callback();
      }
      return;
    }
    fs.readFile(pathToFile, this.options.encoding, function(err, content) {
      var imports, _base1, _base2;
      if (err || !content) {
        console.log(err);
        if (typeof (_base1 = _this.options).callback === "function") {
          _base1.callback();
        }
        return;
      }
      imports = content.match(_this.importReg);
      if (!Array.isArray(imports)) {
        if (typeof (_base2 = _this.options).callback === "function") {
          _base2.callback();
        }
        return;
      }
      imports.forEach(function(importStr) {
        var arRelative, dfd, fullPath, relativePath;
        dfd = Deferred.defer();
        relativePath = importStr.replace(/@import\s*/ig, '').replace(/"/g, '');
        arRelative = relativePath.split('/');
        arRelative[arRelative.length - 1] = "_" + arRelative[arRelative.length - 1];
        relativePath = arRelative.join('/');
        fullPath = path.resolve(dir, relativePath);
        if (fs.existsSync("" + fullPath + ".scss")) {
          fullPath = "" + fullPath + ".scss";
        } else if (fs.existsSync("" + fullPath + ".sass")) {
          fullPath = "" + fullPath + ".sass";
        } else {
          return;
        }
        _this.deps.push(fullPath);
        new ScssFile(fullPath, _.extend({}, _this.options, {
          callback: function(list) {
            if (list == null) {
              list = [];
            }
            _this.deps = _this.deps.concat(list);
            return dfd.resolve();
          }
        }));
        return promises.push(dfd.promise);
      });
      return Deferred.all(promises).then(function() {
        var _base3;
        return typeof (_base3 = _this.options).callback === "function" ? _base3.callback(_this.deps) : void 0;
      });
    });
  }

  return ScssFile;

})();

file = new ScssFile('../my.mail.ru/data/ru/css/sass/main.scss', {
  callback: function(list) {
    return console.log(list);
  }
});

module.exports = function() {};