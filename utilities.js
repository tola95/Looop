// Returns true if the given element has the given class
hasClass = function(elem, cls) {
	return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

var dispatchMouseEvent = function(target, var_args) {
  var e = document.createEvent("MouseEvents");
  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
  target.dispatchEvent(e);
};