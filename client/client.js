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

Meteor.subscribe("userData", function () {
    if (Meteor.userId()) {
      console.log(Meteor.users.findOne({_id: Meteor.userId()}).bio);
      var bio = Meteor.users.findOne({_id: Meteor.userId()}).bio;
      var fullname = Meteor.users.findOne({_id: Meteor.userId()}).fullname;
      
      if (bio) {
        document.getElementById('description').innerHTML = bio;
      }
      if (fullname) {
        document.getElementById('fullname').innerHTML = fullname;
      }
    }
});

window.onload = function() {
  audioController  = new AudioControl();}


Template.home.events({
  'click #me': function(event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  }
});

// Retrieves the array of paths for the given instrument from the database
getInstrumentSounds = function(instrument) {
  if (!Sounds) {
    return;
  }
  return Sounds.findOne({"instrument": instrument}).paths;
}  

toggle_sidebar = function() {
  classie.toggle( event.target, 'active');
    var menuLeft = document.getElementById('cbp-spmenu-s1')
    classie.toggle( menuLeft, 'cbp-spmenu-open');
}

Template.recording_controls.events({
  'click #record-button': function() {
    document.getElementById("record-button").style.display = "none";
    document.getElementById("stop-button").style.display = "inline-block";
    audioController.record();  
  },

  'click #stop-button': function() { 
    document.getElementById("record-button").style.display = "inline-block";
    document.getElementById("stop-button").style.display = "none";
    audioController.stopRecording(); 
    //Meteor.call("addRecording");
    updateSaveRecordingVisibility("block");
  }

});

Template.home.events({
  'click #sidebar-button': function(event) {
    toggle_sidebar();
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
  // Meteor.call("publishRecording", "record");
  // Meteor.call("follow", "FXdumNGxaj668xcHe");
  var key = event.keyCode;
  if (Session.get("activeInstrumentView") ==  DRUM_VIEW) {
    var button = document.getElementById("key-" + key);
    if(button) {
      classie.addClass(button, "active-button");
    }
  } else {
    var button = document.getElementById("pkey-" + key);
    if(button)
      classie.addClass(button, "key-pressed");
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
      classie.removeClass(button, "active-button");
    } else {
      classie.removeClass(button, "key-pressed");
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
    toggle_sidebar();
  },

  'click .keyboard_options': function() {
    Session.set("activeInstrumentView", KEYBOARD_VIEW);
    toggle_sidebar();
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
    if (!sounds) {
      return;
    }
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

Template.main.events = {
   'click #timelinebutton' : function() {
      document.getElementById('recordings').style.display = "none";
      document.getElementById('timeline').style.display = "block";
   },

   'click #recordingsbutton' : function() {
      document.getElementById('recordings').style.display = "block";
      document.getElementById('timeline').style.display = "none";
   }
};

Template.bio.events = {
  'click #update' : function() {

    var description = document.getElementById("desc_text").value;
    var fullname = document.getElementById("fname_text").value;

    if (Meteor.userId()) {
      Meteor.users.update({
        _id: Meteor.userId()
        }, {
          $set: {"bio": description,
                 "fullname": fullname } 
      })
    }

    document.getElementById('description').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).bio;
    document.getElementById('fullname').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).fullname;

    document.getElementById("desc_text").value = "";
    document.getElementById("fname_text").value = "";
  },

  'click #addProfilePic' : function() {


  }
};


Session.setDefault("activeInstrumentView", DRUM_VIEW);
Session.setDefault("sessionRecordings", new Array());
var numberOfRecordingToShow = 5;
var secondaryRecordingArray = new Array();

Template.home.helpers({
  activeView: function () { return Session.get("activeInstrumentView"); },

  recordings: function () {
    if (Meteor.userId() != null){
      secondaryRecordingArray = Meteor.call("getRecordings", Meteor.userId());
      return numOfRecordingsToShow(secondaryRecordingArray);
    } else {
      return Session.get("sessionRecordings");      
    }
  },

});

Template.save_recording.events({
  'click button': function() {
    updateSaveRecordingVisibility("none");
  },

  'click #save-recording-okay': function(){
    var name = document.getElementById('recording-name-input').value;
    audioController.recorder.getBuffer(function (blob){
      if (Meteor.userId() != null){
        var newRecording = new Recording(name, Meteor.userId(), blob);
        //add to the database
        Meteor.call("addRecording", newRecording);
      } else {
        var newRecording = new Recording(name, Meteor.userId(), blob);
        console.log(newRecording);
        console.log(newRecording.blob);
        secondaryRecordingArray.unshift(newRecording);
        var newRecordingArray = Session.get("sessionRecordings");
        newRecordingArray.unshift(newRecording);
        Session.set("sessionRecordings", newRecordingArray);
      }
    });
    audioController.clearRecording();
  },

  'click #save-recording-cancel': function() {
    audioController.clearRecording();
  },

  'keypress': function(event) {
    if (event.keyCode == 13) {
      document.getElementById("save-recording-okay").click();
    }
  }

});


/* Sets the display style of the set recordings box. 
  Must be passed "block" or "none" */
updateSaveRecordingVisibility = function(visibility) {
  elems = document.getElementsByClassName("save-recording");
  for (var i=0; i<elems.length; i++) {
      elems[i].style.display = visibility;
  }
  if (visibility == "block") {
    document.getElementById("recording-name-input").select();
  }  
}

//When a user logs in 
Accounts.onLogin(function() {
  //var recentRecordings = Session.get("sessionRecordings");
  //console.log("Session recordings after log in " + recentRecordings);
  for (var i = 0; i < secondaryRecordingArray.length; i++){
    secondaryRecordingArray[i].name = Meteor.userId();
    Meteor.call("addRecording", secondaryRecordingArray[i]);
    Session.set("sessionRecordings", new Array());
    secondaryRecordingArray = new Array();
  }
});

//When a user logs outs 
Accounts.onLogout(function() {
  Session.set("sessionRecordings", new Array());
  secondaryRecordingArray = new Array();
  numberOfRecordingToShow = 5;
});

numOfRecordingsToShow = function(recs) {
  if(recs.length < numberOfRecordingToShow) {
    return recs;
  } else {
    var newCurrentRecordings = new Array();
    for(var i = 0; i < numberOfRecordingToShow; i++) {
      newCurrentRecordings[i] = recs[i];
    }
    return newCurrentRecordings;
  }
}

Template.record_strip.events({
  'click input' : function (event){
    var inputId = event.target.id;
    console.log("the inputId is " + inputId);
    if (Meteor.userId() != null){
      var qRec = Meteor.call("getARecording", inputId);
      qRec.playRecoding(audioController.context);
      } 
    else {
      for(var i = 0; i < secondaryRecordingArray.length; i++){
        if(inputId == secondaryRecordingArray[i].createdAt){
          console.log(secondaryRecordingArray[i]);
          console.log(secondaryRecordingArray[i].blob);

          playRecording(secondaryRecordingArray[i].blob);
        }
        break;
      }
    }
  }
});


playRecording = function( buffers ) {
  var newSource = audioController.context.createBufferSource();
  var newBuffer = audioController.context.createBuffer( 2, buffers[0].length, audioController.context.sampleRate );
  newBuffer.getChannelData(0).set(buffers[0]);
  newBuffer.getChannelData(1).set(buffers[1]);
  newSource.buffer = newBuffer;
  newSource.connect( audioController.context.destination );
  newSource.start(0);
}


