var TIMELINE_VIEW = "timeline_view",
    RECORDINGS_VIEW = "recordings_view";

Meteor.subscribe("userData");

Template.bio.helpers({
  fullname: function() {
    var user = Meteor.user();
    if (user) {
      return user.fullname;
    }
  },

  bio: function() {
    var user = Meteor.user();
    if (user) {
      return user.bio;
    }
  },

  genres: function() {
    var user = Meteor.user();
    if (user) {
      return user.genres;
    }
  }
});

Template.followings.helpers({
  numberFollowers: function() {
    var user = Meteor.user();
    if (user && user.followers) {
      return user.followers.length;
    }
  },
  numberFollowing: function() {
    var user = Meteor.user();
    if (user && user.following) {
      return user.following.length;
    }
  }
});

Session.setDefault("feedView", TIMELINE_VIEW);

Template.usermain.events = {
   'click #timelinebutton' : function() {
      Session.set("feedView", TIMELINE_VIEW);
      document.getElementById('recordings').style.display = "none";
      document.getElementById('timeline').style.display = "block";
   },

   'click #recordingsbutton' : function() {
      Session.set("feedView", RECORDINGS_VIEW);
      document.getElementById('recordings').style.display = "block";
      document.getElementById('timeline').style.display = "none";
   }
};

Template.usermain.helpers({
  feedView: function() {
    return Session.get("feedView");
  }
});

Template.details.helpers({
  fullname: function() {
    var user = Meteor.user();
    if (user) {
      return user.fullname;
    }
  },

  bio: function() {
    var user = Meteor.user();
    if (user) {
      return user.bio;
    }
  },

  genres: function() {
    var user = Meteor.user();
    if (user) {
      return user.genres;
    }
  }
});

Template.details.events = {
  'click #update' : function() {
    var description = document.getElementById("desc_text").value;
    var fullname = document.getElementById("fname_text").value;
    var genres = document.getElementById("genres_text").value;

    Meteor.call("updateProfileInfo", description, fullname, genres);

    document.getElementById("desc_text").value = "";
    document.getElementById("fname_text").value = "";
  },


  'change #addProfilePic' : function(event, template) {
    var files = event.target.files;

    Meteor.call("addProfilePhoto", files);
  }
};