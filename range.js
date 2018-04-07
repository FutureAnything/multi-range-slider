var Emitter = require('mittens')

module.exports = Range

function Range (options) {
  var range = this;

  this.bar = options.bar;
  this.id = options.id;
  this.allowChange = options.allowChange;

  this.el = document.createElement('div');
  this.el.className = 'mrs-range';

  this.label = document.createElement('div');
  this.label.className = 'mrs-label';
  this.el.appendChild(this.label);

  this.remove = document.createElement('div');
  this.remove.className = 'mrs-remove';
  this.el.appendChild(this.remove);

  this.right_handler = document.createElement('div');
  this.right_handler.className = 'mrs-right-handler';
  this.el.appendChild(this.right_handler);

  this.left_handler = document.createElement('div');
  this.left_handler.className = 'mrs-left-handler';
  this.el.appendChild(this.left_handler);

  this.pressed = false;
  this.isRemoving = false;
  this._value = options.value;

  this._mousemove = function (event) {
    return range.mousemove(event);
  };
  this._mouseup = function (event) {
    return range.mouseup(event);
  };
  this._mousedown = function (event) {
    return range.mousedown(event);
  };
  this._remove = function () {
    range.setValue([0, 0]);
    range.emitter.emit('change', range.data());
  };

  document.addEventListener('mousemove', this._mousemove);
  this.bar.el.addEventListener('mousedown', this._mousedown);
  this.remove.addEventListener('click', this._remove);
  document.addEventListener('mouseup', this._mouseup);
  this.el.ondragstart = function () {
    return false;
  };

  this.emitter = new Emitter
  this.setValue(options.value)
}

function RangeProto () {
  this.removeEvents = removeEvents
  this.mousedown = mousedown
  this.mousemove = mousemove
  this.mouseup = mouseup
  this.setValue = setValue
  this.renderRemovePopup = renderRemovePopup
  this.removeRemovingPopup = removeRemovingPopup
  this.render = render
  this.setValue = setValue
  this.getValue = getValue
  this.data = data
}

RangeProto.call(Range.prototype)

function removeEvents () {
  this.bar.el.removeEventListener('mousedown', this._mousedown);
  this.remove.removeEventListener('click', this._remove);
  document.removeEventListener('mousemove', this._mousemove);
  document.removeEventListener('mouseup', this._mouseup);
}

function mousedown (event) {
  if (this.allowChange === false) {
    return;
  }
  if ([this.el, this.label].indexOf(event.target) !== -1) {
    this.pressed = true;
    this.pressedMode = 'this';
  }
  if (event.target == this.right_handler) {
    this.pressed = true;
    this.pressedMode = 'right';
  }
  if (event.target == this.left_handler) {
    this.pressed = true;
    this.pressedMode = 'left';
  }

  if (this.pressed) {
    this.el.classList.add('mrs-pressed');
    this.el.classList.add('mrs-pressed-' + this.pressedMode);
    this.pressedPosition = this.bar.roundUserValue(this.bar.getCursor(event));
    this.emitter.emit('click', this.data());
  }
}

function renderRemovePopup () {
  this.isRemoving = true;

  this.elRemovePopup = document.createElement('div');
  this.elRemovePopup.className = 'mrs-remove-popup';

  this.elRemoveLabel = document.createElement('div');
  this.elRemoveLabel.className = 'mrs-remove-label';
  this.elRemoveLabel.innerHTML = '×';

  this.elRemovePopup.appendChild(this.elRemoveLabel);
  this.el.appendChild(this.elRemovePopup);
}

function removeRemovingPopup () {
  this.isRemoving = false;
  this.el.removeChild(this.elRemovePopup);
}

function mousemove (event) {
  if (this.pressed) {
    var cursor = this.bar.getCursor(event);
    var difference = cursor - this.pressedPosition;
    var roundDifference = this.bar.roundUserValue(difference);

    if (roundDifference == 0) {
      return;
    }

    var newRight = this.right;
    var newLeft = this.left;

    if (this.pressedMode == 'this') {
      newRight += roundDifference;
      newLeft += roundDifference;
    }
    if (this.pressedMode == 'right') {
      newRight += roundDifference;
    }
    if (this.pressedMode == 'left') {
      newLeft += roundDifference;
    }

    if (newLeft < this.bar.options.min) {
      return;
    }
    if (newRight > this.bar.options.max) {
      return;
    }

    if (newRight < newLeft) {
      return;
    }

    var intersection = false;

    var i = 0, range
    while (range = this.bar.rangeList[i++]) {
      if (intersection) {
        break;
      }
      if (range == this) {
        continue;
      }
      if (range.left < newRight && newRight <= range.right) {
        intersection = true;
      }
      if (range.left <= newLeft && newLeft < range.right) {
        intersection = true;
      }
      if (newLeft <= range.left && range.right <= newRight) {
        intersection = true;
      }
    }

    if (intersection) {
      return;
    }

    this.pressedPosition += roundDifference;

    if (this.bar.options.allowRemove) {
      if (newRight - newLeft < this.bar.options.minWidth) {
        if (!this.isRemoving) {
          this.renderRemovePopup();
        }
      } else {
        if (this.isRemoving) {
          this.removeRemovingPopup();
        }
      }
    } else {
      if (newRight - newLeft < this.bar.options.minWidth) {
        return;
      }
    }

    if (newRight == newLeft) {
      this.el.classList.add('mrs-zero-width');
    } else {
      this.el.classList.remove('mrs-zero-width');
    }

    this.setValue([newLeft, newRight]);
    this.emitter.emit('changing', this.data());
  }
}

function mouseup (event) {
  if (this.isRemoving) {
    this.removeRemovingPopup();
    this.emitter.emit('remove', this.data());
  }
  this.el.classList.remove('mrs-pressed');
  this.el.classList.remove('mrs-pressed-' + this.pressedMode);
  if ([this.el, this.left_handler, this.right_handler, this.label].indexOf(event.target) === -1 && !this.pressed) {
    return;
  }

  this.pressed = false;
  this.pressedPosition = undefined;

  var old_value = this._value;
  var new_value = this.data().val;
  if (new_value[0] != old_value[0] || new_value[1] != old_value[1]) {
    this.emitter.emit('change', this.data());
    this._value = [new_value[0], new_value[1]];
  }
}

function render () {
  var pixelLeft = parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.left)));
  var pixelRight = parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.right)));
  this.el.style.left = pixelLeft + 'px';
  this.el.style.width = pixelRight - pixelLeft + 'px';
  if (this.right - this.left < this.bar.options.minWidth) {
    this.label.innerHTML = '';
  } else {
    this.label.innerHTML = this.bar.options.label([this.left, this.right], this.data());
  }
}

function setValue (value) {
  this.left = value[0];
  this.right = value[1];
  this.render();
}

function getValue () {
  return [this.left, this.right].map(this.bar.options.valueFormat);
}

function data (_data) {
  if (_data !== undefined) {
    if (_data.val !== undefined) {
      this.setValue(_data.val);
    }
    if (_data.allowChange !== undefined) {
      this.allowChange = _data.allowChange;
    }
  }
  return {
    id: this.id,
    val: this.getValue(),
    el: this.el,
    allowChange: this.allowChange
  };
}
