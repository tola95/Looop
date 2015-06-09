var STARTING_DRUM = "drum1",
    STARTING_KEYBOARD = "grandpiano",
    DRUM_VIEW = "drum_buttons",
    KEYBOARD_VIEW = "keys",

    drumcont = 0,
    keycont = 0,
    audioController;

// Retrieves the array of paths for the given instrument from the database
var getInstrumentSounds;

// Once the Sounds DB is ready, set the default drum and keyboard notes
var soundsDB = Meteor.subscribe("sounds", function() {
  getInstrumentSounds = function(instrument) {
    return Sounds.findOne({"instrument": instrument}).paths;
  } 
  updateDrumSounds(getInstrumentSounds(STARTING_DRUM));
  updatePianoSounds(getInstrumentSounds(STARTING_KEYBOARD));
});

Meteor.subscribe("userData", function () {
    if (Meteor.userId()) {
      var bio = Meteor.users.findOne({_id: Meteor.userId()}).bio;
      var fullname = Meteor.users.findOne({_id: Meteor.userId()}).fullname;
      var genres = Meteor.users.findOne({_id: Meteor.userId()}).genres;
      var followers = 0;
      var following = 0;
      
      if (bio) {
        document.getElementById('description').innerHTML = bio;
      }
      if (fullname) {
        document.getElementById('fullname').innerHTML = fullname;
      }
      if (genres) {
        document.getElementById('genres').innerHTML = genres;
      }
        document.getElementById('nooffollowers').innerHTML = followers;
        document.getElementById('nooffollowing').innerHTML = following;
    }
});

Meteor.subscribe("images");

Session.setDefault("drumRendered", false);
window.onload = function() {
  audioController  = new AudioControl();
  audioController.addAudioSources();
}

Template.banner.events({
  'click #notifications-wrapper': function() {
    var value = document.getElementById('notif_block').style.display;
    console.log(document.getElementById('notif_block').style.display);
    if (value == 'inline-block') {
      document.getElementById('notif_block').style.display = 'none'; 
    }
    else {
      document.getElementById('notif_block').style.display = 'inline-block';
    }
    Meteor.call('updateSeenNotification');
  }
 
});

Template.home.events({
  'click #me': function(event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  },
  'click #editdetailspage': function(event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  }
});



Session.setDefault("activeInstrumentView", DRUM_VIEW);

Template.home.helpers({
  activeView: function () { return Session.get("activeInstrumentView"); },

  recordings: function () {
    return Session.get("sessionRecordings");
  },

  loadMore: function() {
    return Session.get("sessionRecordings").length > 5;
  }

});

toggle_sidebar = function() {
  classie.toggle( event.target, 'active');
    var menuLeft = document.getElementById('cbp-spmenu-s1')
    classie.toggle( menuLeft, 'cbp-spmenu-open');
};

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
    Meteor.call("record");
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

Template.banner.helpers({
  notifs: function() {

    var user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'notifications': 1}});
    if (!user) {
      return [];
    }
    var notifications = user.notifications;
    if(!notifications) {
      return[];
    }
    console.log(user.notifications);
    console.log(notifications);
    return notifications;
  },

  seenNotif: function() {
    var seenArr = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'seenNotification': 1}});
    if (!seenArr) {
      return[];
    } 
    var seen = seenArr.seenNotification; 
    if(!seen) {
      return[];
    }
    return seen;
  }
});

Template.notifications.helpers({
  typeIs: function(type) {
    return this.ttype == type;
  }
});

Template.soundpad_button.events({
  'mousedown': function (e, template) {
    // Play corresponding audio file
    var audio = template.find('audio');
    if (!audio.paused) {
      var clone = audio.cloneNode(true);
      audioController.addSource(clone);
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
  // Meteor.call("follow", "6jiKDu8DWW6JBvdrG");
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
  'click .drum_options ': function(event, template) {
    Session.set("activeInstrumentView", DRUM_VIEW);
    document.getElementById("p-wrapper").style.display = "none";
    document.getElementById("buttoncontainer").style.display = "block";
    toggle_sidebar();
  },

  'click .keyboard_options': function(event, template) {
    Session.set("activeInstrumentView", KEYBOARD_VIEW);
    document.getElementById("p-wrapper").style.display = "block";
    document.getElementById("buttoncontainer").style.display = "none";
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
      audioController.addSource(clone);
      clone.play();
      return;
    }
    audio.load();
    audio.play();
  }
});

Template.usermain.events = {
   'click #timelinebutton' : function() {
      document.getElementById('recordings').style.display = "none";
      document.getElementById('timeline').style.display = "block";
   },

   'click #recordingsbutton' : function() {
      document.getElementById('recordings').style.display = "block";
      document.getElementById('timeline').style.display = "none";
   }
};

Template.details.events = {
  'click #update' : function() {

    var description = document.getElementById("desc_text").value;
    var fullname = document.getElementById("fname_text").value;
    var genres = document.getElementById("genres_text").value;

    if (Meteor.userId()) {
      Meteor.users.update({
        _id: Meteor.userId()
        }, {
          $set: {"bio": description,
                 "fullname": fullname, 
                 "genres": genres
                } 
      })
    }

    document.getElementById('description').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).bio;
    document.getElementById('fullname').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).fullname;
    document.getElementById("genres").innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).genres;

    document.getElementById("desc_text").value = "";
    document.getElementById("fname_text").value = "";
  },


  'change #addProfilePic' : function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if (err) {
          console.log(err);
        } else {
          console.log(fileObj);
        }
      });
    }
  }
  
};


Session.setDefault("sessionRecordings", new Array());

Template.save_recording.events({
  'click button': function() {
    updateSaveRecordingVisibility("none");
  },

  'click #save-recording-okay': function(){
    var name = document.getElementById('recording-name-input').value;
    audioController.recorder.getBuffer(function (blob){
      if (Meteor.userId() != null){
        var newRecording = createNewRecordingObject(name, Meteor.userID, blob, audioController);
        //add to the database
        //Meteor.call()
      } else {
        var newRecording = createNewRecordingObject(name, Meteor.userID, blob, audioController);
        var newRecordingArray = Session.get("sessionRecordings");
        newRecordingArray.push(newRecording);
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


createNewRecordingObject = function(name, user, blob, context){
  return new Recording(name, user, blob, context);
}
