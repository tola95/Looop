Router.route('/', function () {
  this.render('home');
});

Router.route('/user', function () {
	if (Meteor.user()) {
	  this.render('personal');
	} else {
		this.redirect("/");
	}
});

Router.route('/details', function () {
	if (Meteor.user()) {
	  this.render('details');
	} else {
		this.redirect("/");
	}
});

Router.route('/upload.php', function() {
	if (Meteor.user()) {
	  this.render('upload');
	} else {
		this.redirect("/");
	}  
});