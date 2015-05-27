/* Piano notes by http://www.freesound.org/people/jobro/
   Attribution license: http://creativecommons.org/licenses/by/3.0/ */
Session.setDefault("audio_file1", "/sounds/piano/piano-A4.wav");
Session.setDefault("audio_file2", "/sounds/piano/piano-Bb4.wav");
Session.setDefault("audio_file3", "/sounds/piano/piano-B4.wav");
Session.setDefault("audio_file4", "/sounds/piano/piano-C4.wav");
Session.setDefault("audio_file5", "/sounds/piano/piano-Db4.wav");
Session.setDefault("audio_file6", "/sounds/piano/piano-D4.wav");
Session.setDefault("audio_file7", "/sounds/piano/piano-Eb4.wav");
Session.setDefault("audio_file8", "/sounds/piano/piano-E4.wav");
Session.setDefault("audio_file9", "/sounds/piano/piano-F4.wav");

getSoundPath = function(sound) {
  return "/sounds/piano/piano-" + sound + ".wav";
}

getInstrumentSounds = function(instrument) {
  return Sounds.findOne({instrument: instrument}).paths;
}  


populate = function() {
  var instruments = ["drum1", "drum2", "grandPiano", "churchOrgan"];
  var instrumentSounds = {
    "drum1": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4"],

    "drum2": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4"],

    "grandPiano": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5", "piano/piano-F5", "piano/piano-Gb5", "piano/piano-G5", 
      "piano/piano-Ab5", "piano/piano-A6", "piano/piano-Bb6", "piano/piano-B6"],

    "churchOrgan": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5", "piano/piano-F5", "piano/piano-Gb5", "piano/piano-G5", 
      "piano/piano-Ab5", "piano/piano-A6", "piano/piano-Bb6", "piano/piano-B6"]
  };

  for (instrument in instrumentSounds) {
    for (var i=0; i<instrumentSounds[instrument].length; i++) {
      instrumentSounds[instrument][i] = "/sounds/" + instrumentSounds[instrument][i] ;
    }
  }

  for (var i=0; i<instruments.length; i++) {
    var instrument = instruments[i];
    Meteor.call("addSound", instrument, instrumentSounds[instrument]);
  }
};


Template.buttons.helpers({
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

/*
  Get the button that was clicked
  Get its id (instrument)
  Have a setDrumNotes function and a setPianoNotes function - take instrument
  Get the tracks from the database based on the instrument
  Loop over the array of file paths and sets the audio source variables
*/

Template.body.events({
  'click #choice_submit': function() {
    var button_dropdown = document.getElementById("button_choice");
    var button_num = button_dropdown.options[button_dropdown.selectedIndex].value;
    var sound_dropdown = document.getElementById("sound_choice");
    var sound = sound_dropdown.options[sound_dropdown.selectedIndex].value;
    Session.set("audio_file" + button_num, getSoundPath(sound));
  }
});

Template.soundpad_button.events({
  'click': function (e, template) {
    // Play corresponding audio file
    var sounds = getInstrumentSounds("grandPiano");
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
    }
  }
