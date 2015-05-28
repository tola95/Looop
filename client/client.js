var STARTING_DRUM = "drum1";
var STARTING_KEYBOARD = "grandpiano";

// Set the default drum and keyboard notes
window.onload = function() {
  updateDrumSounds(getInstrumentSounds(STARTING_DRUM));
  updatePianoSounds(getInstrumentSounds(STARTING_KEYBOARD));
}

// Retrieves the array of paths for the given instrument from the database
getInstrumentSounds = function(instrument) {
  return Sounds.findOne({instrument: instrument}).paths;
}  


populate = function() {
  var instruments = ["drum1", "drum2", "grandpiano", "churchorgan"];
  var instrumentSounds = {
    "drum1": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4"],

    "drum2": ["piano/piano-C3", "piano/piano-Db3", "piano/piano-D3", "piano/piano-Eb3", "piano/piano-E3", 
      "piano/piano-F3", "piano/piano-Gb3", "piano/piano-G3", "piano/piano-Ab3"],

    "grandpiano": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5", "piano/piano-F5", "piano/piano-Gb5", "piano/piano-G5", 
      "piano/piano-Ab5", "piano/piano-A6", "piano/piano-Bb6", "piano/piano-B6"],

    "churchorgan": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5", "piano/piano-F5", "piano/piano-Gb5", "piano/piano-G5", 
      "piano/piano-Ab5", "piano/piano-A6", "piano/piano-Bb6", "piano/piano-B6"]
  };

  for (instrument in instrumentSounds) {
    for (var i=0; i<instrumentSounds[instrument].length; i++) {
      instrumentSounds[instrument][i] = "/sounds/" + instrumentSounds[instrument][i] + ".wav";
    }
  }

  for (var i=0; i<instruments.length; i++) {
    var instrument = instruments[i];
    Meteor.call("addSound", instrument, instrumentSounds[instrument]);
  }
};


Template.drum_buttons.helpers({
  audio_file1: function () { return Session.get("audio_file1"); },
  audio_file2: function () { return Session.get("audio_file2"); },
  audio_file3: function () { return Session.get("audio_file3"); },
  audio_file4: function () { return Session.get("audio_file4"); },
  audio_file5: function () { return Session.get("audio_file5"); },
  audio_file6: function () { return Session.get("audio_file6"); },
  audio_file7: function () { return Session.get("audio_file7"); },
  audio_file8: function () { return Session.get("audio_file8"); },
  audio_file9: function () { return Session.get("audio_file9"); },
});

Template.soundpad_button.events({
  'click': function (e, template) {
    // Play corresponding audio file
    template.find('audio').play();
  }
});


// Simulate button press on corresponding key press
document.onkeydown = function(event) {
  var key = event.keyCode;
  var button = document.getElementById("key-" + key);
  if (button) {
    button.className = button.className + " active-button";
    button.click();
  }
};
 
document.onkeyup = function(event) {
  var key = event.keyCode;
  var button = document.getElementById("key-" + key);
  if (button) {
    button.className = "";
  }
};


// Make sign in require username instead of email
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


// Respond to events in the instrument menu
Template.menu.events = {
  'click #drum1': function() {
    document.getElementById("buttoncontainer").style.display = "block";
    document.getElementById("p-wrapper").style.display = "none";
  },

  'click #drum2': function() {
    document.getElementById("buttoncontainer").style.display = "block";
    document.getElementById("p-wrapper").style.display = "none";
  },

  'click #grandpiano': function() {
    document.getElementById("p-wrapper").style.display = "block";
    document.getElementById("buttoncontainer").style.display = "none";
  },

  'click #churchorgan': function() {
    document.getElementById("p-wrapper").style.display = "block";
    document.getElementById("buttoncontainer").style.display = "none";
  },

  'click #drumcontainer': function() {
    document.getElementById("drums").style.display = "block";
  },

  'click #keycontainer': function() {
    document.getElementById("keys").style.display = "block";
  },

  // Update the audio sources
  'click button': function(event) {
    var button = event.target;
    sounds = getInstrumentSounds(button.id);
    if (hasClass(button, "keyboard")) {
      updatePianoSounds(sounds);
    } else {
      updateDrumSounds(sounds);
    }
  }
};

// Updates the buttons to play the tracks with the given paths
updateDrumSounds = function(paths) {
  for (var i = 0; i<paths.length; i++) {
    Session.set("audio_file" + (i+1), paths[i]);
  }
};

// Updates the keys to play the tracks with the given paths
updatePianoSounds = function(paths) {
  for (var i = 0; i<paths.length; i++) {
    Session.set("key" + (i+1), paths[i]);
  }
};

// Variables for each audio file path needed for the keyboard
Template.keys.helpers({
  key1: function() { return Session.get("key1"); },
  key2: function() { return Session.get("key2"); },
  key3: function() { return Session.get("key3"); },
  key4: function() { return Session.get("key4"); },
  key5: function() { return Session.get("key5"); },
  key6: function() { return Session.get("key6"); },
  key7: function() { return Session.get("key7"); },
  key8: function() { return Session.get("key8"); },
  key9: function() { return Session.get("key9"); },
  key10: function() { return Session.get("key10"); },
  key11: function() { return Session.get("key11"); },
  key12: function() { return Session.get("key12"); },
  key13: function() { return Session.get("key13"); },
  key14: function() { return Session.get("key14"); },
  key15: function() { return Session.get("key15"); },
  key16: function() { return Session.get("key16"); },
  key17: function() { return Session.get("key17"); },
  key18: function() { return Session.get("key18"); },
  key19: function() { return Session.get("key19"); },
  key20: function() { return Session.get("key20"); },
  key21: function() { return Session.get("key21"); },
  key22: function() { return Session.get("key22"); },
  key23: function() { return Session.get("key23"); },
  key24: function() { return Session.get("key24"); }
});

Template.keys.events({
  'click .playable': function(e, template) {
    var audio = e.target.getElementsByClassName("audio")[0];
    audio.play();
  }
});

