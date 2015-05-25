Template.buttons.helpers({
  /* Piano notes by http://www.freesound.org/people/jobro/
     Attribution license: http://creativecommons.org/licenses/by/3.0/ */
  audio_file1: "/sounds/piano/piano-32.wav",
  audio_file2: "sounds/piano/piano-33.wav",
  audio_file3: "sounds/piano/piano-34.wav",
  audio_file4: "sounds/piano/piano-35.wav",
  audio_file5: "sounds/piano/piano-36.wav",
  audio_file6: "sounds/piano/piano-37.wav",
  audio_file7: "sounds/piano/piano-38.wav",
  audio_file8: "sounds/piano/piano-39.wav",
  audio_file9: "sounds/piano/piano-40.wav",
});

Template.buttons.events({
  'click button': function (e, template) {
    // Play corresponding audio file
    template.find('audio').play();
  }
}); 