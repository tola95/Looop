Router.route('/', function () {
  this.render('home');
});

Router.route('/user/:userID', function () {
	var userId = this.params.userID;
	var user = Meteor.users.findOne({ _id: userId});
	console.log("userId: " + userId);
	console.log(user);
	// if (user) {
	  this.render('personal', {data:{"userId": userId}});
	// } else {
	// 	this.redirect("/");
	// }
});

Router.route('/upload.php', function() {
	if (Meteor.user()) {
	  this.render('upload');
	} else {
		this.redirect("/");
	}  
});