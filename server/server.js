Meteor.startup(function () {
	if (Sounds.find().count() == 0) {
		populateSounds();
	}
});

// Populates Sounds DB with paths for default instruments
var populateSounds = function() {
  var instruments = ["drum1", "drum2", "grandpiano", "churchorgan"];
  var instrumentSounds = {
    "drum1": ["drums/Kick-01", "drums/Hat-02", "drums/Snr-02", "drums/Hat-03", "drums/Kick-02", 
      "drums/Hat-04", "drums/Snr-03", "drums/OpHat-02", "drums/Kick-03"],

    "drum2": ["drums/Kick-01", "drums/Hat-02", "drums/Snr-04", "drums/Hat-03", "drums/Kick-02", 
      "drums/Hat-04", "drums/Snr-05", "drums/OpHat-03", "drums/Kick-03"],

    "grandpiano": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5"],

    "churchorgan": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5"]
  };

  for (instrument in instrumentSounds) {
    for (var i=0; i<instrumentSounds[instrument].length; i++) {
      instrumentSounds[instrument][i] = "/sounds/" + instrumentSounds[instrument][i] + ".wav";
    }
  }

  for (var i=0; i<instruments.length; i++) {
    var instrument = instruments[i];
    addSound(instrument, instrumentSounds[instrument]);
  }
};

var addSound = function(name, paths) {
	Sounds.insert({
		instrument: name,
		paths: paths
	});
}

Meteor.publish("sounds", function() {
	return Sounds.find();
});

Meteor.publish("userData", function () {
  return Meteor.users.find(
    {_id: this.userId},
    {fields: {'bio': 1, 
              'fullname': 1, 
              'genres': 1, 
              'profilephoto': 1, 
              'following': 1,
              'followers': 1
             }
    }
  );
});

Meteor.users.allow({
  update: function (userId, user, fields, modifier) {
    // can only change your own documents
    return (user._id === userId);
   
  }
});

Meteor.publish("images", function () {
  return Images.find();
});

