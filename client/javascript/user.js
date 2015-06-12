var TIMELINE_VIEW = "timeline_view",
    RECORDINGS_VIEW = "recordings_view";

Meteor.subscribe("allUserData");
Meteor.subscribe("userData");

addRecording = function() {
  Meteor.call("addRecordings", {name: "song 1", user: "n4iBCeyiBFDu8M6po", published: true});
  Meteor.call("addRecordings", {name: "song 2", user: "n4iBCeyiBFDu8M6po", published: false});
}

Template.personal.helpers({
  currentUserPage: function() {
    return String(Meteor.userId()) === String(Template.instance().data.userId);
  }
});

Template.personal.events({
  'click #follow-button': function(event, template) {
    Meteor.call("follow", template.data.userId);
  },

  'click #unfollow-button': function(event, template) {
    Meteor.call("unfollow", template.data.userId);
  }
});

Template.personaldetails.helpers({
  currentUserPage: function() {
    return String(Meteor.userId()) === String(Template.instance().data.userId);
  },

  followingUser: function() {
    var otherUser = Template.instance().data.userId;
    var currentUser = Meteor.user();
    if (currentUser && currentUser.following) {
      return currentUser.following.indexOf(otherUser) != -1;
    }
  },

  notOwnProfile: function() {
    return String(Meteor.userId()) !== String(Template.instance().data.userId);
  }
});

Template.bio.helpers({
  fullname: function() {
    var user = Meteor.users.findOne({_id: Router.current().params.userID});
    if (user) {
      if (user.fullname) {
        return user.fullname;
      } else {
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
};

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

// Helpers for view of current user's recordings on their own profile
Template.recordings_view.helpers({
  recordings: function() {
    var userId = Meteor.userId();
    if (userId) {
      return Recordings.find({user: userId}, {}, {limit: 10});
    }
  }
});