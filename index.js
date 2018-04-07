var Bar = require('./bar')

module.exports = mrs

function mrs (options) {
  if (!(this instanceof mrs)) {
    return new mrs(options)
  }

  options = _transformOptions.call(this, options || {});
  _validateOptions.call(this, options);
  this._bar = new Bar(options);

  this.el = document.createElement('div');
  this.el.className = 'mrs-slider';
  this.el.appendChild(this._bar.el);
}

function proto () {
  this.add = add
  this.remove = remove
  this.removeAll = removeAll
  this.rangeValue = rangeValue
  this.rangeData = rangeData
  this.render = render
  this.val = val
  this.data = data
  this.on = on
  this.off = off
}

proto.call(mrs.prototype)

function add (value, options) {
  options = options || {}
  value = _transformValue.call(this,value);
  _validateValue.call(this, value);

  if (options.id !== undefined && this._bar.rangeList.find(function (x) {
    return x.id === options.id;
  })) {
    throw new Error('range with this id already exists');
  }
  if (this._bar.getInsideRange(value[0]) || this._bar.getInsideRange(value[1])) {
    throw new Error('intersection');
  }

  var i = 0, range
  while (range = this._bar.rangeList[i++]) {
    if (value[0] <= range.left && range.right <= value[1]) {
      throw new Error('intersection');
    }
  }

  return this._bar.add(value, options);
}

function remove (rangeId) {
  if (!Number.isInteger(rangeId)) {
    throw new Error('wrong data');
  }
  return this._bar.remove(rangeId);
}

function removeAll () {
  var rangeList = this._bar.rangeList
  var i = 0, l = rangeList.length
  for (; i < l; i++) this._bar.remove(rangeList[i].id)
}

function rangeValue (rangeId, value) {
  if (!Number.isInteger(rangeId)) {
    throw 'rangeId should be integer';
  }
  var range = this._bar.rangeList.find(function (x) {
    return x.id === rangeId;
  });
  if (!range) {
    return false;
  }
  if (value === undefined) {
    return range.getValue();
  } else {
    return range.setValue(value);
  }
}

function rangeData (rangeId, data) {
  if (!Number.isInteger(rangeId)) {
    throw 'rangeId should be integer';
  }
  var range = this._bar.rangeList.find(function (x) {
    return x.id === rangeId;
  });
  if (!range) {
    return false;
  }
  return range.data(data);
}

function render () {
  this._bar.render();
}

function val () {
  return this._bar.getValue();
}
    
function data () {
  return this._bar.data();
}

function on(subject, cb) {
  this._bar.emitter.on(subject, cb);
}

function off (subject, cb) {
  this._bar.emitter.off(subject, cb);
}

function _transformOptions (options) {
  if (options.valueParse) {
    var _arr3 = ['min', 'max', 'step', 'minWidth'];

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
      var key = _arr3[_i3];
      options[key] = options.valueParse(options[key]);
    }
  }
  return options;
}

function _validateOptions (options) {
  var _arr4 = ['min', 'max', 'step'];

  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
    var key = _arr4[_i4];
    var value = options[key];
    if (value === undefined) {
      throw new Error(key + ' option is mandatory');
    }
    if (!Number.isInteger(value)) {
      throw new Error(key + ' option should be integer');
    }
  }
  if (options.max <= options.min) {
    throw new Error('max should be greater than min');
  }
  if ((options.max - options.min) % options.step !== 0) {
    throw new Error('there should be an integer number of steps between min and max');
  }

  if (options.minWidth === undefined) {
    options.minWidth = options.step;
  }
  if (options.minWidth % options.step !== 0) {
    throw new Error('there should be an integer number of steps in minWidth');
  }

  if (options.maxRanges !== undefined) {
    if (!Number.isInteger(options.maxRanges)) {
      throw new Error('maxRanges should be integer');
    }
  }

  var _arr5 = ['allowChange', 'allowAdd', 'allowRemove'];
  for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
    var _key2 = _arr5[_i5];
    var _value = options[_key2];
    if ([true, false, undefined].indexOf(_value) === -1) {
      throw new Error(_key2 + ' option should be true, false or undefined');
    }
  }
}

function _transformValue (value) {
  if (this._bar.options.valueParse) {
    value = value.map(this._bar.options.valueParse);
  }
  return value;
}

function _validateValue (value) {
  if (!Array.isArray(value) || value.length != 2) {
    throw Error;
  }
}
