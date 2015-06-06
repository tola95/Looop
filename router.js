Router.route('/', function () {
  this.render('home');
});

Router.route('/user', function () {
  this.render('personal');
});

Router.route('/activity', function() {
	this.render('activity');
});