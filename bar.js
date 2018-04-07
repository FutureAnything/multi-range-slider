var xtend = require('xtend')
var Emitter = require('mittens')
var Ghost = require('./ghost')
var Range = require('./range')
var Base = require('./base')

module.exports = Bar

function Bar (options) {
  var bar = this;

  options = options || {};

  bar.options = xtend({
    allowRemove: true,
    allowAdd: true,
    allowChange: true,
    maxRanges: Infinity,
    ghostLabel: function ghostLabel(value) {
      return '+';
    },
    label: function label(value) {
      return value[0].toString() + '-' + value[1].toString();
    },
    valueParse: function valueParse(value) {
      return value;
    },
    valueFormat: function valueFormat(value) {
      return value;
    }
  }, options);

  bar.el = document.createElement('div');
  bar.el.className = 'mrs-bar';
  if (bar.options.allowChange === false) {
    bar.el.classList.add('mrs-allowChangeFalse');
  }
  bar.el.addEventListener('mousemove', function (event) {
    return bar.mousemove(event);
  });
  bar.el.addEventListener('mouseleave', function (event) {
    return bar.mouseleave(event);
  });
  bar.el.addEventListener('mouseup', function (event) {
    return bar.mouseup(event);
  });
  bar.el.addEventListener('mousedown', function (event) {
    return bar.mousedown(event);
  });
  bar.el.ondragstart = function () {
    return false;
  };

  bar.rangeIdCount = 0;
  bar.rangeList = [];

  bar.emitter = new Emitter;
  return bar;
}

Base.call(Bar.prototype)
BarProto.call(Bar.prototype)

function BarProto () {
  this.getRangeId = getRangeId
  this.proxyRangeEvent = proxyRangeEvent
  this.add = add
  this.remove = remove
  this.removeGhost = removeGhost
  this.getValue = getValue
  this.getInsideRange = getInsideRange
  this.isOverRange = isOverRange
  this.getNewGhostValue = getNewGhostValue
  this.mousedown = mousedown
  this.mouseup = mouseup
  this.mousemove = mousemove
  this.mouseleave = mouseleave
  this.render = render
  this.data = data
}

function getRangeId () {
  // Just return some unique number
  this.rangeIdCount += 1;
  return this.rangeIdCount;
}

function proxyRangeEvent (eventName, range) {
  var _this4 = this;

  range.emitter.on(eventName, function () {
    _this4.emitter.emit(eventName, {
      data: _this4.data(),
      range: range.data()
    });
  });
}

function add (value, options) {
  var _this5 = this;

  if (this.rangeList.length >= this.options.maxRanges) {
    return false;
  }
  options = xtend({
    id: this.getRangeId(),
    value: value,
    allowChange: this.options.allowChange
  }, options, {
    bar: this
  });
  var range = new Range(options);
  this.el.appendChild(range.el);

  this.rangeList.push(range);
  this.removeGhost();

  var rangeId = range.id;

  var _arr = ['remove', 'changing', 'change', 'click'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var eventName = _arr[_i];
    this.proxyRangeEvent(eventName, range);
  }

  range.emitter.on('remove', function () {
    _this5.remove(rangeId);
  });

  var _arr2 = ['change', 'add'];
  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var _eventName = _arr2[_i2];
    this.emitter.emit(_eventName, {
      data: this.data(),
      range: range.data()
    });
  }

  return range;
}

function remove (rangeId) {
  var range = this.rangeList.find(function (x) {
    return x.id == rangeId;
  });
  if (range) {
    range.removeEvents();
    this.el.removeChild(range.el);
    this.rangeList = this.rangeList.filter(function (x) {
      return x.id !== rangeId;
    });
    return true;
  } else {
    return false;
  }
}

function removeGhost () {
  if (this.ghost) {
    this.ghost.removeEvents();
    this.el.removeChild(this.ghost.el);
    delete this.ghost;
  }
}

function mousedown (event) {}

function mouseup(event) {
  if (this.ghost) {
    this.add([this.ghost.left, this.ghost.right]);
  }
}

function mouseleave (event) {
  this.removeGhost();
}

function getInsideRange (cursor) {
  var i = 0, range
  while (range = this.rangeList[i++]) {
    if (range.left < cursor && cursor < range.right) {
      return range
    }
  }
  return false
}

function isOverRange (left, right) {
  var i = 0, range
  while (range = this.rangeList[i++]) {
    if (left <= range.left && range.right <= right) {
      return true
    }
  }
  return false
}

function getNewGhostValue (cursor) {
  if (this.getInsideRange(cursor)) {
    return null;
  }

  cursor = this.roundUserValue(cursor);
  var h = this.options.minWidth / this.options.step;
  var dLeft = Math.floor(h / 2) * this.options.step;
  var dRight = Math.floor((h + 1) / 2) * this.options.step;

  var left = cursor - dLeft;
  var right = cursor + dRight;

  if (this.options.max < right) {
    right = this.options.max;
    if (right - left < this.options.minWidth) {
      left = this.options.max - this.options.minWidth;
    }
  }

  if (left < this.options.min) {
    left = this.options.min;
    if (right - left < this.options.minWidth) {
      right = this.options.min + this.options.minWidth;
    }
  }

  var rangeLeft = this.getInsideRange(left);
  if (rangeLeft) {
    left = rangeLeft.getValue()[1];
    right = left + this.options.minWidth;
  }

  var rangeRight = this.getInsideRange(right);
  if (rangeRight) {
    right = rangeRight.getValue()[0];
    left = right - this.options.minWidth;
  }

  if (this.getInsideRange(left) || this.getInsideRange(right)) {
    return null;
  }

  if (left < this.options.min) {
    return null;
  }
  if (this.options.max < right) {
    return null;
  }

  return [left, right];
}

function mousemove (event) {
  if (this.ghost) {
    return;
  }
  if (this.options.allowAdd == false) {
    return;
  }
  if (this.rangeList.length >= this.options.maxRanges) {
    return;
  }
  if (this.rangeList.filter(function (x) {
    return x.pressed;
  }).length > 0) {
    return;
  }

  var cursor = this.getCursor(event);
  var newGhostValue = this.getNewGhostValue(cursor);
  if (newGhostValue == null) {
    return;
  }

  this.ghost = new Ghost({ bar: this });
  this.el.appendChild(this.ghost.el);
  this.ghost.setValue(newGhostValue);
}

function getValue () {
  return this.rangeList.map(function (range) {
    return range.getValue()
  })
}

function data () {
  return this.rangeList.map(function (x) {
    return x.data();
  });
}

function render () {
  var i = 0, range
  while (range = this.rangeList[i++]) {
    range.render()
  }
}
