Router.route('/', function () {
  this.render('home');
});

Router.route('/user', function () {
  this.render('personal');
});