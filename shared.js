// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

Meteor.methods({
	addSound: function (name, path) {
		Tasks.insert({
			name: name,
			path: path
		});
	},

	getSoundPath: function(sound) {
		return "/sounds/piano/piano-" + sound + ".wav";
	}
})