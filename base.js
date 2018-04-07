module.exports = BaseProto

function BaseProto () {
  this.pixelToUnit = pixelToUnit 
  this.unitToPixel = unitToPixel 
  this.unitToUser = unitToUser
  this.userToUnit = userToUnit
  this.roundUserValue = roundUserValue
  this.getCursor = getCursor
}

function isInDOMTree(node) {
  return !!findUltimateAncestor(node).body;
}

function findUltimateAncestor(node) {
  var ancestor = node;
  while (ancestor.parentNode) {
    ancestor = ancestor.parentNode;
  }
  return ancestor;
}

function pixelToUnit (value) {
  if (!isInDOMTree(this.el)) {
    throw new Error('element is not in dom!');
  }
  var rect = this.el.getBoundingClientRect();
  var width = rect.width;
  if (width == 0) {
    throw new Error('element width is 0 or element is not attached to dom');
  }
  return value / width;
}

function unitToPixel (value) {
  var rect = this.el.getBoundingClientRect();
  var width = rect.width;
  return value * width;
}

function unitToUser (value) {
  return (this.options.max - this.options.min) * value + this.options.min;
}

function userToUnit (value) {
  return (value - this.options.min) / (this.options.max - this.options.min);
}

function roundUserValue (value) {
  return this.options.min + Math.floor((value - this.options.min) / this.options.step) * this.options.step;
}

function getCursor (event) {
  // event is mousemove event
  // returns unitValue of place where the event has been made

  var rect = this.el.getBoundingClientRect();
  var x = event.clientX - rect.left;
  return this.unitToUser(this.pixelToUnit(x));
}
