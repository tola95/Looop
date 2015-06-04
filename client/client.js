var STARTING_DRUM = "drum1",
    STARTING_KEYBOARD = "grandpiano",
    DRUM_VIEW = "drum_buttons",
    KEYBOARD_VIEW = "keys",

    drumcont = 0,
    keycont = 0,
    audioController;

// Once the Sounds DB is ready, set the default drum and keyboard notes
var soundsDB = Meteor.subscribe("sounds", function() {
  updateDrumSounds(getInstrumentSounds(STARTING_DRUM));
  updatePianoSounds(getInstrumentSounds(STARTING_KEYBOARD));
});

window.onload = function() {
  audioController  = new AudioControl();
}

Template.body.events({
  'click #record': function() { audioController.record(); },
  'click #stop': function() { audioController.stopRecording(); }
});


// Retrieves the array of paths for the given instrument from the database
getInstrumentSounds = function(instrument) {
  return Sounds.findOne({"instrument": instrument}).paths;
}  

Session.setDefault("activeInstrumentView", DRUM_VIEW);

Template.home.helpers({
  activeView: function () { return Session.get("activeInstrumentView"); }
});

Template.home.events({
  'click #record': function() { audioController.record(); },
  'click #stop': function() { audioController.stopRecording(); },
  'click #sidebar-button': function(event) {
    classie.toggle( event.target, 'active');
    var menuLeft = document.getElementById('cbp-spmenu-s1')
    classie.toggle( menuLeft, 'cbp-spmenu-open');
  }
});


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
  'mousedown': function (e, template) {
    // Play corresponding audio file
    var audio = template.find('audio');
    if (!audio.paused) {
      var clone = audio.cloneNode(true);
      clone.play();
      return;
    }
    audio.load();
    audio.play();
  }
});

// Simulate button press on corresponding key press
document.onkeydown = function(event) {
  if (event.target != document.getElementsByTagName("BODY")[0]) {
    return;
  }

  var key = event.keyCode;
  if (Session.get("activeInstrumentView") ==  DRUM_VIEW) {
    var button = document.getElementById("key-" + key);
    if(button) {
      button.className = button.className + " active-button";
    }
  } else {
    var button = document.getElementById("pkey-" + key);
    if(button)
      button.className = button.className + " div.anchor:active";
  }
  if (button) {
    dispatchMouseEvent(button, 'mousedown', true, true);
  }
};
 
document.onkeyup = function(event) {
  if (event.target != document.getElementsByTagName("BODY")[0]) {
    return;
  }

  var key = event.keyCode;
  if (Session.get("activeInstrumentView") ==  DRUM_VIEW) {
    var button = document.getElementById("key-" + key);
  } else {
    var button = document.getElementById("pkey-" + key);
  }
  if (button) {
    if (Session.get("activeInstrumentView") ==  DRUM_VIEW) {
      button.className = "";
    } else {
    button.className = "anchor playable";
    }
  }
};

// Make sign in require username instead of email
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


// Respond to events in the instrument menu
Template.instrument_menu.events = {
  'click .drum_options ': function() {
    Session.set("activeInstrumentView", DRUM_VIEW);
  },

  'click .keyboard_options': function() {
    Session.set("activeInstrumentView", KEYBOARD_VIEW);
  },

  'click #drumcontainer': function() {
    if (drumcont == 0) {
      document.getElementById("drums").style.display = "block";
      drumcont = 1;
    } else {
      document.getElementById("drums").style.display = "none";
      drumcont = 0;
    }
  },

  'click #keycontainer': function() {
    if (drumcont == 0) {
      document.getElementById("keys").style.display = "block";
      drumcont = 1;
    } else {
      document.getElementById("keys").style.display = "none";
      drumcont = 0;
    }
  },

  // Update the audio sources
  'click button': function(event) {
    var button = event.target;
    sounds = getInstrumentSounds(button.id);
    if (classie.has(button, "keyboard_options")) {
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
});

Template.keys.events({
  'mousedown .playable': function(e, template) {
    var audio = e.target.getElementsByClassName("audio")[0];
    if (!audio.paused) {
      var clone = audio.cloneNode(true);
      clone.play();
      return;
    }
    audio.load();
    audio.play();
  }
});
