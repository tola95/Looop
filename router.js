Router.route('/', function () {
  this.render('home');
});

Router.route('/timeline', function () {
  this.render('profile');
});

Router.route('/activity', function() {
	this.render('activity');
});