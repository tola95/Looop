Router.route('/', function () {
  this.render('home');
});

Router.route('/user', function () {
  this.render('personal');
});

Router.route('/details', function () {
  this.render('details');
});

Router.route('/upload.php', function() {
  this.render('upload');
});