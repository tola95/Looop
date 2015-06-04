Router.route('/', function () {
  this.render('home');
});

Router.route('/timeline', function () {
  this.render('profile');
});