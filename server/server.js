Meteor.startup(function () {
	if (Sounds.find().count() == 0) {
		populateSounds();
	}
});

// Populates Sounds DB with paths for default instruments
var populateSounds = function() {
  var instruments = ["drum1", "drum2", "grandpiano", "churchorgan"];
  var instrumentSounds = {
    "drum1": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4"],

    "drum2": ["piano/piano-C3", "piano/piano-Db3", "piano/piano-D3", "piano/piano-Eb3", "piano/piano-E3", 
      "piano/piano-F3", "piano/piano-Gb3", "piano/piano-G3", "piano/piano-Ab3"],

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
    {fields: {'bio': 1, 'fullname': 1}}
  );
});

Meteor.users.allow({
  update: function (userId, user, fields, modifier) {
    // can only change your own documents
    return (user._id === userId);
   
  }
});
