module.exports = Ghost

function Ghost (options) {
  var _this = this;

  this.bar = options.bar;

  this.el = document.createElement('div');
  this.el.className = 'mrs-ghost';

  this.label = document.createElement('div');
  this.label.className = 'mrs-label';
  this.el.appendChild(this.label);

  this.pressed = false;

  this._mousemove = function (event) {
    return _this.mousemove(event);
  };
  this._mousedown = function (event) {
    return _this.mousedown(event);
  };
  this._mouseup = function (event) {
    return _this.mouseup(event);
  };

  this.bar.el.addEventListener('mousemove', this._mousemove);
  this.bar.el.addEventListener('mousedown', this._mousedown);
  this.bar.el.addEventListener('mouseup', this._mouseup);
}

GhostProto.call(Ghost.prototype)

function GhostProto () {
  this.removeEvents = removeEvents
  this.mousedown = mousedown
  this.mouseup = mouseup
  this.mousemove = mousemove
  this.setValue = setValue
}

function removeEvents () {
  this.bar.el.removeEventListener('mousemove', this._mousemove);
  this.bar.el.removeEventListener('mousedown', this._mousedown);
  this.bar.el.removeEventListener('mouseup', this._mouseup);
}

function mousedown (event) {
  if ([this.el, this.label].indexOf(event.target) !== -1) {
    this.pressed = true;
  }
}

function mouseup (event) {
  this.pressed = false;
}

function mousemove (event) {
  var cursor = this.bar.getCursor(event);

  if (this.bar.getInsideRange(cursor)) {
    if (!this.pressed) {
      this.bar.removeGhost();
    }
    return;
  }

  var center = (this.left + this.right) / 2;
  cursor = this.bar.roundUserValue(cursor);

  var h = this.bar.options.minWidth / this.bar.options.step;
  var dLeft = Math.floor(h / 2) * this.bar.options.step;
  var dRight = Math.floor((h + 1) / 2) * this.bar.options.step;

  var _ref = [this.left, this.right],
      newLeft = _ref[0],
      newRight = _ref[1];


  if (this.pressed) {
    if (cursor < center) {
      newLeft = cursor - dLeft;
    }
    if (cursor > center) {
      newRight = cursor + dRight;
    }
  } else {
    newLeft = cursor - dLeft;
    newRight = cursor + dRight;
  }

  if (newRight > this.bar.options.max) {
    newRight = this.bar.options.max;
    if (!this.pressed) {
      newLeft = newRight - this.bar.options.minWidth;
    }
  }
  if (newLeft < this.bar.options.min) {
    newLeft = this.bar.options.min;
    if (!this.pressed) {
      newRight = newLeft + this.bar.options.minWidth;
    }
  }

  if (this.bar.getInsideRange(newLeft) || this.bar.getInsideRange(newRight)) {
    return;
  }

  if (this.bar.isOverRange(newLeft, newRight)) {
    return;
  }

  this.setValue([newLeft, newRight]);
}

function setValue (value) {
  this.left = value[0];
  this.right = value[1];
  var pixelLeft = parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.left)));
  var pixelRight = parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.right)));
  this.el.style.left = pixelLeft + 'px';
  this.el.style.width = pixelRight - pixelLeft + 'px';
  this.label.innerHTML = this.bar.options.ghostLabel(value);
}
