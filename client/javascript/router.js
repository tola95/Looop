var allUsers = Meteor.subscribe("allUserData");

Router.route('/', function () {
  this.render('home');
});

Router.route('/user/:userID', function () {
	var userId = this.params.userID;
	if (allUsers.ready()) {
		var user = Meteor.users.findOne({ _id: userId});
		if (user && Meteor.user()) {
		  this.render('personal', {data:{"userId": userId}});
		} else {
			this.redirect("/");
		}
	} else {
		this.redirect("/user/" + userId);
	}
});

Router.route('/upload.php', function() {
	if (Meteor.user()) {
	  this.render('upload');
	} else {
		this.redirect("/");
	}  
});