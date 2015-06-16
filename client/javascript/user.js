var TIMELINE_VIEW = "timeline_view",
    RECORDINGS_VIEW = "recordings_view",
    FEED_LENGTH_LIMIT = 10,
    SUGGESTIONS_LIMIT = 3,
    DEFAULT_PROFILE_PHOTO = "/images/dj.jpg";

Meteor.subscribe("allUserData");
Meteor.subscribe("userData");

Session.setDefault("feedView", TIMELINE_VIEW);

getProfileId = function() {
  return Router.current().params.userID;
}

Template.personal.helpers({
  currentUserPage: function() {
    return String(Meteor.userId()) === String(getProfileId());
  }
});

Template.personal.events({
  'click #follow-button': function(event, template) {
    Meteor.call("follow", getProfileId());
  },

  'click #unfollow-button': function(event, template) {
    Meteor.call("unfollow", getProfileId());
  }
});

Template.personaldetails.helpers({
  currentUserPage: function() {
    return String(Meteor.userId()) === String(getProfileId());
  },

  followingUser: function() {
    var otherUser = getProfileId();
    var currentUser = Meteor.user();
    if (currentUser && currentUser.following) {
      return currentUser.following.indexOf(otherUser) != -1;
    }
  },

  notOwnProfile: function() {
    return String(Meteor.userId()) !== String(getProfileId());
  }
});

Template.bio.helpers({
  fullname: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});
    if (user) {
      if (user.fullname) {
        return user.fullname;
      } else {
        return user.username;
      }
    }
  },

  bio: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});
    if (user) {
      return user.bio;
    }
  },

  genres: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});
    if (user) {
      return user.genres;
    }
  }
});

Template.followings.helpers({
  numberFollowers: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});
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
    var user = Meteor.users.findOne({_id: getProfileId()});
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
    if (String(Meteor.userId()) === String(getProfileId())) {
      updateListFollowingVisibility("block");
    } else {
      updateprofile_ListFollowingVisibility("block");
    }
  },

  'click #followers' : function() {
    if (String(Meteor.userId()) === String(getProfileId())) {
      updateListFollowersVisibility("block");
    } else {
      updateprofile_ListFollowersVisibility("block");
    }
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

Template.profile_listFollowing.events({
  'click .closebox' : function() {
    updateprofile_ListFollowingVisibility("none");
  }

});

Template.profile_listFollowers.events({
  'click .closebox' : function() {
    updateprofile_ListFollowersVisibility("none");
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

updateprofile_ListFollowersVisibility = function(visibility) {
  elems = document.getElementsByClassName("profile-list-followers");
  for (var i=0; i<elems.length; i++) {
    elems[i].style.display = visibility;
  }
}

updateprofile_ListFollowingVisibility = function(visibility) {
  elems = document.getElementsByClassName("profile-list-following");
  for (var i=0; i<elems.length; i++) {
    elems[i].style.display = visibility;
  }
}

Template.current_usermain.events = {
   'click #timelinebutton' : function() {
      Session.set("feedView", TIMELINE_VIEW);
   },

   'click #recordingsbutton' : function() {
      Session.set("feedView", RECORDINGS_VIEW);
   }
};

Template.current_usermain.helpers({
  feedView: function() {
    return Session.get("feedView");
  }
});

Template.other_usermain.helpers({
  published_recordings: function() {
    var userId = getProfileId();
    return Recordings.find({user: userId, published: true}, {sort: {createdAt: -1}, limit: FEED_LENGTH_LIMIT});
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

var updateProfilePhoto = function(file) {
  Images.insert(file, function (err, fileObj) {
    if (err) {
       alert("failed to upload profile photo");
    } else {
      var imagesURL = {
        "profilePhotoId" : fileObj._id,
      };
      Meteor.call("updatePhoto", imagesURL);
    }
  });
}

var updateCoverPhoto = function(file) {
  Images.insert(file, function (err, fileObj) {
    if (err) {
       alert("failed to upload cover photo");
    } else {
      var imagesURL = {
        "coverPhotoId": fileObj._id
      };
      Meteor.call("updatePhoto", imagesURL);
    }
  });
}

Template.details.events({
  'click #update' : function(event, template) {
    var description = document.getElementById("desc_text").value;
    var fullname = document.getElementById("fname_text").value;
    var genres = document.getElementById("genres_text").value;
    var profileFile = template.find("#addProfilePic").files[0];
    var coverFile = template.find("#addHeaderPic").files[0];

    Meteor.call("updateProfileInfo", description, fullname, genres);

    if (profileFile) {
      updateProfilePhoto(profileFile)
    }

    if (coverFile) {
      updateCoverPhoto(coverFile);
    }

    updateSaveDetailsVisibility("none");
  },

  'click .closebox' : function() {
    updateSaveDetailsVisibility("none");
  },
});

Template.listofFollowers.helpers({
  follower: function() {
    var followers = Meteor.users.find({following: Meteor.userId()} );
    if (followers) {
      return followers;
    }
  },

  followingUser: function() {
    var otherUser = this._id;
    var currentUser = Meteor.user();
    if (currentUser && currentUser.following) {
      return currentUser.following.indexOf(otherUser) != -1;
    }
  },

  userpage: function() {
    return "/user/" + this._id;
  }
});

// Helpers for view of current user's recordings on their own profile
Template.recordings_view.helpers({
  recordings: function() {
    var userId = Meteor.userId();
    if (userId) {
      return Recordings.find({user: userId}, {sort: {createdAt: -1}, limit: FEED_LENGTH_LIMIT});
    }
  }

});

Template.listofFollowing.helpers({
  following: function() {
    var following = Meteor.users.find({followers: Meteor.userId()} );
    if (following) {
      return following;
    }
  },

  userpage: function() {
    return "/user/" + this._id;
  }

});

Template.profile_listofFollowers.helpers({
  follower: function() {
    var followers = Meteor.users.find({following: getProfileId()} );
    if (followers) {
      return followers;
    }
  },

  followingUser: function() {
    var otherUser = this._id;
    var currentUser = Meteor.user();
    if (currentUser && currentUser.following) {
      return currentUser.following.indexOf(otherUser) != -1;
    }
  },

  userIsNotYou: function() {
    return this._id != Meteor.userId();
  },

  userpage: function() {
    return "/user/" + this._id;
  }

});

Template.profile_listofFollowing.helpers({
  following: function() {
    var following = Meteor.users.find({followers: getProfileId()} );
    if (following) {
      return following;
    }
  },

  followingUser: function() {
    var otherUser = this._id;
    var currentUser = Meteor.user();
    if (currentUser && currentUser.following) {
      return currentUser.following.indexOf(otherUser) != -1;
    }
  },

  userIsNotYou: function() {
    return this._id != Meteor.userId();
  },

  userpage: function() {
    return "/user/" + this._id;
  }

});

Template.listofFollowing.events({
  'click .unfollow-from-popup': function() {
    var id = this._id;
    Meteor.call("unfollow", id);
  }
});

Template.listofFollowers.events({
  'click .unfollow-from-popup': function() {
    var id = this._id;
    Meteor.call("unfollow", id);
  },

  'click .follow-from-popup': function() {
    var id = this._id;
    Meteor.call("follow", id);
  }
});

Template.profile_listofFollowing.events({
  'click .unfollow-from-popup': function() {
    var id = this._id;
    Meteor.call("unfollow", id);
  },

  'click .follow-from-popup': function() {
    var id = this._id;
    Meteor.call("follow", id);
  }
});

Template.profile_listofFollowers.events({
  'click .unfollow-from-popup': function() {
    var id = this._id;
    Meteor.call("unfollow", id);
  },

  'click .follow-from-popup': function() {
    var id = this._id;
    Meteor.call("follow", id);
  }
});


Template.header.helpers({
  profile_src: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});

    if (user) {
      var image = Images.findOne({_id: user.profilePhotoId});
      if (image) {
        return image.url();
      } else {
        return DEFAULT_PROFILE_PHOTO;
      }
    }
  },

  cover_src: function() {
    var user = Meteor.users.findOne({_id: getProfileId()});
    if (user) {
      var image = Images.findOne({_id: user.coverPhotoId});
      if (image) {
        return image.url();
      }
    }
  }
});

Template.suggestions.helpers({
  suggested: function() {
    var myId = Meteor.userId();
    if (myId) {
      var genre = Meteor.user().genres;
      var followings = Meteor.user().following;
      if (followings.length > 0) {
        var suggestedUsers = Meteor.users.find({_id: {$ne: myId},
                                             genres: genre,
                                             followers: {$nin: [myId]}
                                             }, {limit: SUGGESTIONS_LIMIT});
      } else {
        var suggestedUsers = Meteor.users.find({_id: {$ne: myId}
                                             }, {limit: SUGGESTIONS_LIMIT});
      }
      
      if (suggestedUsers) {
        return suggestedUsers;
      }
    }
  },

  userpage: function() {
    return "/user/" + this._id;
  }
});

Template.suggestions.events({
  'click .follow-from-popup': function() {
    var id = this._id;
    Meteor.call("follow", id);
  }
});