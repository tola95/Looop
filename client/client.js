Template.buttons.helpers({
  /* Piano notes by http://www.freesound.org/people/jobro/
     Attribution license: http://creativecommons.org/licenses/by/3.0/ */
  audio_file1: "/sounds/piano/piano-32.wav",
  audio_file2: "/sounds/piano/piano-33.wav",
  audio_file3: "/sounds/piano/piano-34.wav",
  audio_file4: "/sounds/piano/piano-35.wav",
  audio_file5: "/sounds/piano/piano-36.wav",
  audio_file6: "/sounds/piano/piano-37.wav",
  audio_file7: "/sounds/piano/piano-38.wav",
  audio_file8: "/sounds/piano/piano-39.wav",
  audio_file9: "/sounds/piano/piano-40.wav",
});

Template.button.events({
  'click': function (e, template) {
    // Play corresponding audio file
    template.find('audio').play();
  }
});

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
