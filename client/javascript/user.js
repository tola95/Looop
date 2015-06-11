var TIMELINE_VIEW = "timeline_view",
    RECORDINGS_VIEW = "recordings_view";

Meteor.subscribe("userData");
Meteor.subscribe("allUserData");

addRecording = function() {
  Meteor.call("addRecordings", {name: "published", user: "zJrMK9gDyHRovmKg2", published: true});
  // Meteor.call("addRecordings", {name: "unpublished", user: "zJrMK9gDyHRovmKg2", published: false});
}

Template.personal.helpers({
  currentUserPage: function() {
    return Meteor.userId() == Template.instance().data.userId;
  }
});

Template.personal.events({
  'click .follow-button': function(event, template) {
    Meteor.call("follow", template.data.userId);
  }
});

Template.bio.helpers({
  fullname: function() {
    // console.log("id: "+ Router.current().params.userID);
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    // console.log("user: " + user);
    if (user) {
      if (user.fullname) {
        // console.log("fullname: " + user.fullname);
        return user.fullname;
      } else {
        // console.log("username: " + user.username);
        return user.username;
      }
    }
  },

  bio: function() {
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    if (user) {
      return user.bio;
    }
  },

  genres: function() {
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    if (user) {
      return user.genres;
    }
  }
});

Template.followings.helpers({
  numberFollowers: function() {
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    if (user && user.followers) {
      var length = user.followers.length;
      if (length > 0) {
        return length;
      } else {
        return 0;
      }
    }
  },
  numberFollowing: function() {
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    if (user && user.following) {
      var length = user.following.length;
      if (length > 0) {
        return length;
      } else {
        return 0;
      }
    }
  }
});

Template.followings.events({
  'click #following' : function() {
    updateListFollowersVisibility("block");
  },

  'click #followers' : function() {
    updateListFollowingVisibility("block");
  }
  
});

Template.listFollowing.events({
  'click .closebox' : function() {
    updateListFollowingVisibility("none");
  }

});

Template.listFollowers.events({
  'click .closebox' : function() {
    updateListFollowersVisibility("none");
  }
  
});

updateListFollowersVisibility = function(visibility) {
  elems = document.getElementsByClassName("list-followers");
  for (var i=0; i<elems.length; i++) {
    elems[i].style.display = visibility;
  }
}

updateListFollowingVisibility = function(visibility) {
  elems = document.getElementsByClassName("list-following");
  for (var i=0; i<elems.length; i++) {
    elems[i].style.display = visibility;
  }
}

Session.setDefault("feedView", TIMELINE_VIEW);

Template.current_usermain.events = {
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

Template.current_usermain.helpers({
  feedView: function() {
    return Session.get("feedView");
  }
});

Template.edetails.events({
  'click #editdetailslink' : function() {
    updateSaveDetailsVisibility("block");
  }
});

updateSaveDetailsVisibility = function(visibility) {
  elems = document.getElementsByClassName("save-details");
  for (var i=0; i<elems.length; i++) {
    elems[i].style.display = visibility;
  }
}


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
    updateSaveDetailsVisibility("none");
  },

  'click .closebox' : function() {
    updateSaveDetailsVisibility("none");
  },

  'change #addProfilePic' : function(event, template) {
    var files = event.target.files;

    Meteor.call("addProfilePhoto", files);
  }
};

Template.other_usermain.helpers({
  published_recordings: function() {
    return Recordings.find({user: Router.current().params.userID, published: true});
  }
});