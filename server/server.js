Meteor.startup(function () {
	
	Meteor.publish("sounds", function() {
		return Sounds.find();
	});
});