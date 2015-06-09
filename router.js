Router.route('/', function () {
  this.render('home');
});

Router.route('/user', function () {
  this.render('personal');
});

<<<<<<< HEAD
Router.route('/details', function () {
  this.render('details');
});

Router.route('/upload.php', function() {
  this.render('upload');
=======
Router.route('/activity', function() {
	this.render('activity');
>>>>>>> af4a8c06817d973aed94577a31fe119189dba5a2
});