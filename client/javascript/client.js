var STARTING_DRUM = "drum1",
    STARTING_KEYBOARD = "grandpiano",
    DRUM_VIEW = "drum_buttons",
    KEYBOARD_VIEW = "keys",
    // keydown = 0,
    // mousedownID = -1,

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

Meteor.subscribe("images");
Meteor.subscribe("recordings");
Meteor.subscribe("allUserData");

Session.setDefault("drumRendered", false);
window.onload = function() {
  audioController  = new AudioControl();
  audioController.addAudioSources();
}

document.addEventListener("click", function(event) { 
  var t = event.target.id;
  if (t != "searchText" && t != "results") {
    var elem = document.getElementById('results');
    if (elem) {
      if(elem.style.display == 'block') {
        elem.style.display = 'none';
        document.getElementById('searchText').value = "Search..";
      } 
    }
    
  }
  
});

Template.banner.events({
  'click #notifications-wrapper': function() {
    var value = document.getElementById('notif_block').style.display;
    // console.log(document.getElementById('notif_block').style.display);
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
    updateSaveRecordingVisibility("block");
  }

});

Template.search.events({
  'click #searchText': function() {
    document.getElementById('searchText').value = "";
    document.getElementById('results').style.display = "block";
  },

  'keypress': function(event) {
    if (event.keyCode == 13) {
      var name = document.getElementById('searchText').value;
      var user = Meteor.users.findOne({username: name}, {fields: {'_id': 1}});
      var newDiv = document.createElement("div");
      newDiv.id = "result_cont";
      var elm = document.getElementById("results");

      var exits = document.getElementById("result_cont");
      if(exits) {
        exits.parentNode.removeChild(exits);
      }
      
      if (!user) {
        newDiv.innerHTML = "No results found!";
        elm.appendChild(newDiv);
        return [];
      } else {
        var userID = user._id;
        if (!userID) {
          return [];
        }
        var att = document.createElement("a");
        
        att.setAttribute('href',"/user/" + userID);
        att.innerHTML = "" + name;
        att.id = "user";
        newDiv.appendChild(att);
        elm.appendChild(newDiv);
      }
    }
      
      

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
    return notifications;
  },

  no_notifs: function() {
    var user = Meteor.user();
    if (user && user.notifications) {
      return user.notifications.length == 0;
    } else {
      return true;
    }
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
  },

  currentUserId: function() {
    return Meteor.userId();
  }
});

Template.notifications.helpers({
  typeIs: function(type) {
    return this.ttype == type;
  }
});

Template.soundpad_button.events({
  'mousedown': function (e, template) {
    var audio = template.find('audio');
    if (template.find('.playable').getAttribute('data_on') == 0) {
      audio.load();
      audio.play();
      template.find('.playable').setAttribute('data_on', 1);
    }
    
    if(template.find('.playable').getAttribute('mousedownID') == -1)
    template.find('.playable').setAttribute('mousedownID', setInterval(function() {
    if (!audio.paused) {
      var clone = audio.cloneNode(true);
      audioController.addSource(clone);
      clone.play();
      return;
    }
    audio.load();
    audio.play();
    }, 500));
    // Play corresponding audio file
    
    
  },

  'mouseup': function(e, template) {
    if(template.find('.playable').getAttribute('mousedownID') != 1) {
      clearInterval(template.find('.playable').getAttribute('mousedownID'));
      template.find('.playable').setAttribute('mousedownID', -1);
    }
    template.find('.playable').setAttribute('data_on', 0);
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
    dispatchMouseEvent(button, 'mouseup', true, true);
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
    console.log(e.target.getAttribute('data_on'));
    if (e.target.getAttribute('data_on') == 0) {
      if (!audio.paused ) {
      var clone = audio.cloneNode(true);
      audioController.addSource(clone);
      clone.play();
      return;
    }
    audio.load();
    audio.play();
  }
  e.target.setAttribute('data_on', 1);
    },

  'mouseup .playable': function(e, template) {
    e.target.setAttribute('data_on', 0);
  }
    
});


Session.setDefault("activeInstrumentView", DRUM_VIEW);
Session.setDefault("sessionRecordings", new Array());
Session.setDefault("numberOfRecordingToShow", 5);

Template.home.helpers({
  activeView: function () { return Session.get("activeInstrumentView"); },

  recordings: function () {
    if (Meteor.userId() != null){
      // return Meteor.call("getRecordings", Meteor.userId(), Session.get("numberOfRecordingToShow"));
      return Recordings.find({user: Meteor.userId()}, {sort: {createdAt: -1}, limit: Session.get("numberOfRecordingToShow")});
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
      var uint8Buffer = [new Uint8Array(blob[0].buffer, 0, blob[0].length*Float32Array.BYTES_PER_ELEMENT),
                         new Uint8Array(blob[1].buffer, 0, blob[1].length*Float32Array.BYTES_PER_ELEMENT)];
      if (Meteor.userId() != null){
        var newRecording = new Recording(name, Meteor.userId(), uint8Buffer);
        Meteor.call("addRecording", newRecording);
      } else {
        var newRecording = new Recording(name, Meteor.userId(), uint8Buffer);
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
  var recentSessionRecordings = Session.get("sessionRecordings");
  for (var i = 0; i < recentSessionRecordings.length; i++){
    recentSessionRecordings[i].user = Meteor.userId();
    Meteor.call("addRecording", recentSessionRecordings[i]);
  }
  Session.set("sessionRecordings", new Array());
});

//When a user logs outs 
Accounts.onLogout(function() {
  Session.set("numberOfRecordingToShow", 5);
});

Template.record_strip.events({
  'click input' : function (event){
    var inputId = event.target.id;
    if (Meteor.userId() != null){
      var qRec = Recordings.findOne({_id:inputId});
      var newFloat32Buffer = [new Float32Array(qRec.blob[0].buffer), new Float32Array(qRec.blob[1].buffer)];
      playRecording(newFloat32Buffer);
      } 
    else {
      var recentSessionRecordings = Session.get("sessionRecordings"); 
      for(var i = 0; i < recentSessionRecordings.length; i++){
        if(inputId == recentSessionRecordings[i].createdAt){
          var newFloat32Buffer = [new Float32Array(recentSessionRecordings[i].blob[0].buffer), new Float32Array(recentSessionRecordings[i].blob[1].buffer)];
          playRecording(newFloat32Buffer);
        }
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
