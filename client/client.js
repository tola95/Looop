// $(document).ready() {
//   lowLag.init({'urlPrefix':'plucks/'});
//   lowLag.load(['pluck.mp3', 'pluck.ogg'],'pluck');
// };

Template.buttons.helpers({
  /* Piano notes by http://www.freesound.org/people/jobro/
     Attribution license: http://creativecommons.org/licenses/by/3.0/ */
  audio_file1: "/sounds/drums/Hat-03.wav",
  audio_file2: "/sounds/drums/Crash-04.wav",
  audio_file3: "/sounds/drums/Kick-01.mp3",
  audio_file4: "/sounds/drums/Rim-01.wav",
  audio_file5: "/sounds/drums/SdSt-04.wav",
  audio_file6: "/sounds/drums/Snr-02.wav",
  audio_file7: "/sounds/drums/Tom-05.wav",
  audio_file8: "/sounds/drums/Tom-01.wav",
  audio_file9: "/sounds/drums/OpHat-01.wav",
});


var dispatchMouseEvent = function(target, var_args) {
  var e = document.createEvent("MouseEvents");
  // If you need clientX, clientY, etc., you can call
  // initMouseEvent instead of initEvent
  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
  target.dispatchEvent(e);
};

Template.button.events({
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

document.onkeydown = function(event) {
  var key = event.keyCode;
  var button = document.getElementById("key-" + key);
  if (button) {
    button.className = button.className + " active-button";
    dispatchMouseEvent(button, 'mousedown', true, true);
  }
};
 

document.onkeyup = function(event) {
  var key = event.keyCode;
  var button = document.getElementById("key-" + key);
  if (button) {
    button.className = "";
  }
};

var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
    showLeft = document.getElementById( 'showLeft' ),
    body = document.body;

showLeft.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( menuLeft, 'cbp-spmenu-open' );
  disableOther( 'showLeft' );
};

showLeftPush.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( body, 'cbp-spmenu-push-toright' );
  classie.toggle( menuLeft, 'cbp-spmenu-open' );
  disableOther( 'showLeftPush' );
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
