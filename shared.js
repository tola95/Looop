// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

Meteor.methods({
	addSound: function (name, paths) {
		Sounds.insert({
			instrument: name,
			paths: paths
		});
	}
});