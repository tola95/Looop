if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.buttons.helpers({
    counter: function () {
      return Session.get('counter');
    },
    audio_file1: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file2: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file3: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file4: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file5: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file6: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file7: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file8: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
    audio_file9: "http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg",
  });

  Template.buttons.events({
    'click button': function (e, template) {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter')+1);
      
      template.find('audio').play();
    }
  });

  Template.reset.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', 0);
    }
  });
}