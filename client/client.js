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


Template.body.events({
  'click #choice_submit': function() {
    var button_dropdown = document.getElementById("button_choice");
    var button_num = button_dropdown.options[button_dropdown.selectedIndex].value;
    var sound_dropdown = document.getElementById("sound_choice");
    var sound = sound_dropdown.options[sound_dropdown.selectedIndex].value;
    Meteor.call("getSoundPath", sound, function(error, result) {
      Session.set("audio_file" + button_num, result);
    });
  }
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

