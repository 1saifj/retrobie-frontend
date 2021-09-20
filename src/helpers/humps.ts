// =========
// = humps =
// =========
// Underscore-to-camelCase converter (and vice versa)
// for strings and object keys

// humps is copyright © 2012+ Dom Christie
// Released under the MIT license.


var _processKeys = function(convert, obj, options?) {
  if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
    return obj;
  }

  var output,
    i = 0,
    l = 0;

  if (_isArray(obj)) {
    output = [];
    for (l = obj.length; i < l; i++) {
      output.push(_processKeys(convert, obj[i], options));
    }
  } else {
    output = {};
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        output[convert(key, options)] = _processKeys(convert, obj[key], options);
      }
    }
  }
  return output;
};

// String conversion methods

var separateWords = function(string, options: {separator?: string, split?: RegExp}) {
  options = options || {};
  var separator = options.separator || ' ';
  var split = options.split || /(?=[A-Z])/;

  return string.split(split).join(separator);
};

var camelize = function(string) {
  if (_isNumerical(string)) {
    return string;
  }
  string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
    return chr ? chr.toUpperCase() : '';
  });
  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1);
};

var pascalize = function(string) {
  var camelized = camelize(string);
  // Ensure 1st char is always uppercase
  return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
};

var decamelize = function(string: string, options?: {separator?: string; split?: RegExp;}) {
  return separateWords(string, options).toLowerCase();
};

// Utilities
// Taken from Underscore.js

var toString = Object.prototype.toString;

var _isFunction = function(obj) {
  return typeof (obj) === 'function';
};
var _isObject = function(obj) {
  return obj === Object(obj);
};
var _isArray = function(obj) {
  return toString.call(obj) == '[object Array]';
};
var _isDate = function(obj) {
  return toString.call(obj) == '[object Date]';
};
var _isRegExp = function(obj) {
  return toString.call(obj) == '[object RegExp]';
};
var _isBoolean = function(obj) {
  return toString.call(obj) == '[object Boolean]';
};

// Performant way to determine if obj coerces to a number
var _isNumerical = function(obj) {
  obj = obj - 0;
  return obj === obj;
};

// Sets up function which handles processing keys
// allowing the convert function to be modified by a callback
var _processor = function(convert, options) {
  var callback = options && 'process' in options ? options.process : options;

  if (typeof (callback) !== 'function') {
    return convert;
  }

  return function(string, options) {
    return callback(string, convert, options);
  };
};

const titleCase = (str: string) => {
  if (str) {
    return str.split(' ')
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ');
  }
  return str;
};

var humps = {
  camelize: camelize,
  decamelize: decamelize,
  pascalize: pascalize,
  depascalize: decamelize,
  camelizeKeys: function(object, options) {
    return _processKeys(_processor(camelize, options), object);
  },
  decamelizeKeys: function(object, options) {
    return _processKeys(_processor(decamelize, options), object, options);
  },
  pascalizeKeys: function(object, options) {
    return _processKeys(_processor(pascalize, options), object);
  },
  depascalizeKeys: function() {
    return this.decamelizeKeys.apply(this, arguments);
  },
  titleCase,
};

export default humps;