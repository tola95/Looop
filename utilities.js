// Returns true if the given element has the given class
hasClass = function(elem, cls) {
	return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
}