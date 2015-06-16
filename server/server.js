var MAX_ACTIVITY_FEED_SIZE = 50;

Meteor.startup(function () {
	if (Sounds.find().count() == 0) {
		populateSounds();
	}
});

// Populates Sounds DB with paths for default instruments
var populateSounds = function() {
  var instruments = ["drum1", "drum2", "drum3", "drum4", "grandpiano", "churchorgan"];
  var instrumentSounds = {
    "drum1": ["acoustic/Crash-02", "acoustic/Hat-01", "acoustic/Kick-01", "acoustic/OpHat-01", "acoustic/Hat", 
      "acoustic/SdSt-03", "acoustic/Snr-01", "acoustic/Snr-09", "acoustic/Tom-04"],

    "drum2": ["electro/CYCdh_ElecK02-Tom01", "electro/CYCdh_ElecK02-Kick01", "electro/CYCdh_ElecK02-FX03", "electro/CYCdh_ElecK02-Clap01", "electro/CYCdh_ElecK01-Tom01", 
      "electro/CYCdh_ElecK01-Snr01", "electro/CYCdh_ElecK01-OpHat02", "electro/CYCdh_ElecK01-ClHat01", "electro/CYCdh_ElecK01-Kick02"],

    "drum3": ["LDrum/kick9", "LDrum/60key", "LDrum/kickscratch_3", "LDrum/3", "LDrum/daunt", "LDrum/hit1", "LDrum/808BONGO", "LDrum/clap1", "LDrum/simplesnare1"],

    "drum4" : ["funky/FX", "funky/Perc-8", "funky/Perc-9", "funky/Perc-10", "funky/Drek22", "funky/DreStb9", "funky/JTroup", "funky/crank", "funky/kickcuku"],

    "grandpiano": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5"],

    "churchorgan": ["piano/piano-C4", "piano/piano-Db4", "piano/piano-D4", "piano/piano-Eb4", "piano/piano-E4", 
      "piano/piano-F4", "piano/piano-Gb4", "piano/piano-G4", "piano/piano-Ab4", "piano/piano-A5", 
      "piano/piano-Bb5", "piano/piano-B5", "piano/piano-C5", "piano/piano-Db5", "piano/piano-D5", 
      "piano/piano-Eb5", "piano/piano-E5"]
  };

  for (instrument in instrumentSounds) {
    for (var i=0; i<instrumentSounds[instrument].length; i++) {
      instrumentSounds[instrument][i] = "/sounds/" + instrumentSounds[instrument][i] + ".wav";
    }
  }

  for (var i=0; i<instruments.length; i++) {
    var instrument = instruments[i];
    addSound(instrument, instrumentSounds[instrument]);
  }
};

var addSound = function(name, paths) {
	Sounds.insert({
		instrument: name,
		paths: paths
	});
}

Accounts.onCreateUser(function(options, user) {
  user.followers = [];
  user.following = [];
  user.activityFeed = [];
  user.notifications = [];
  user.activities = [];
  return user;
});

Meteor.publish("sounds", function() {
	return Sounds.find();
});

Meteor.publish("recordings", function() {
  return Recordings.find();
});

Meteor.publish("activities", function() {
  return Activities.find();
});

Meteor.publish("userData", function () {
  return Meteor.users.find(
    {_id: this.userId},
    {fields: {'bio': 1, 
              'fullname': 1, 
              'genres': 1, 
              'following': 1,
              'followers': 1,
              'seenNotification': 1,
              'activityFeed': 1,
              'notifications': 1,
              'profilePhotoId': 1,
              'coverPhotoId': 1
             }
    })
});

Meteor.publish("allUserData", function () {
  return Meteor.users.find(
  {},
  {fields: {'bio': 1, 
            'fullname': 1, 
            'genres': 1, 
            'following': 1,
            'followers': 1,
            'activityFeed': 1,
            'username': 1,
            'profilePhotoId': 1,
            'coverPhotoId': 1
           }
  })
});

Meteor.publish("images", function(){ 
  return Images.find(); 
});

Meteor.methods({
  /* Called when the user wants to follow someone.
    followedId: userId of the person the current user wants to follow */
  follow: function(followedId) {
    if (!this.userId) {
      // TODO: login popup
      throw new Meteor.Error("not logged in", "Please log in to follow");
    }

    Meteor.users.update({
      _id: this.userId
      }, {
      $addToSet: {following: followedId}
    });

    Meteor.users.update({
      _id: followedId
      }, {
      $addToSet: {followers: this.userId}
    });

    var followedActivities = Meteor.users.findOne({_id: followedId}).activities;
    Meteor.users.update({
     _id: this.userId
     }, {
       $addToSet: {activityFeed: {$each: followedActivities}}
    });

    // Notify followerId
    Meteor.call("addNotification", followedId, new FollowedNotification(Meteor.user().username));
    return 1;
  },

  findByUsername: function(userName) {
    var userr = Meteor.users.findOne({username: userName}, {fields: {'_id': 1}});
    return userr;
  },

  // function for adding the recording to the database when the user finishes recording
  addRecording: function(recording) {
    Recordings.insert(recording);
  },

  //Assuming that the delete button will only allow the user logged in to delete their recording
  deleteRecording: function(recording) {
    Recordings.remove(recording);
  },

  getRecordings: function(userId, num) {
    Recordings.find({user: userId}, {sort: {createdAt: -1}, limit: num});
  },

  getARecording: function(id){
    Recordings.findOne({_id:id});
  },

  /* Called when the current user wants to unfollow the user with id followedId */
  unfollow: function(followedId) {
    Meteor.users.update({
      _id: this.userId
      }, {
      $pull: {following: followedId}
    });
    Meteor.users.update({
      _id: followedId
      }, {
      $pull: {followers: this.userId}
    });

  },

  // Updates the seenNotification field to true to denote that the user has viewed the new notifications
  updateSeenNotification: function() {
    Meteor.users.update({
      _id: this.userId
      }, {
        $set: {seenNotification: true}
    });
  },

  // Adds given notification to the notifications list of the user with ID notifiedUserId
  addNotification: function(notifiedUserId, notification) {
    Meteor.users.update({
      _id: notifiedUserId
    }, {
      $addToSet: {notifications: notification}
    });

    Meteor.users.update({
      _id: notifiedUserId
    }, {
      $set: {seenNotification: false}
    });
  },

  // Publishes the recording to the current user's followers by adding it to the followers' feeds
  publishRecording: function(recordingId) {
    if (!this.userId) {
      throw new Meteor.Error("not logged in", "Please login to publish a recording");
    }

    var recording = Recordings.findOne({_id: recordingId});
    if (!recording || recording.user != this.userId) {
      return;
    }

    var activity = new RecordingActivity(recordingId, Meteor.user().username, recording.name, Meteor.userId());
    var activityId = Activities.insert(activity);

    Recordings.update({_id: recordingId}, {$set: {published: true, activityId: activityId}});

    var followers = Meteor.users.findOne({_id: this.userId}).followers;
    if(followers) {
      for (var i=0; i<followers.length; i++) {
      Meteor.users.update({
        _id: followers[i]
        }, {
        $push: {
          activityFeed: {
            $each: [activityId],
            $slice: -MAX_ACTIVITY_FEED_SIZE
          }
        }
      });
    }
    }
    
    Meteor.users.update({
      _id: Meteor.userId()
      } , {
        $addToSet: {activities: activityId}
    });
  },

  // Deletes the Activity associated with the recording
  unpublishRecording: function(recordingID) {
    var followers = Meteor.users.findOne({_id: this.userId}).followers;
    var activityId = Activities.findOne({recordingId: recordingID}, {fields: {"_id" : 1}});
    var activity = activityId._id;
    if(followers) {
      for (var i=0; i < followers.length; i++) {
        Meteor.users.update({
          _id:followers[i]
          }, {
            $pull : {
              activityFeed: activity
            }
        });
      }
    }

    Meteor.users.update({_id: this.userId}, {
      $pull: {activities: activity}
    });

    Activities.remove({
      recordingId: recordingID
    });

    Recordings.update({
      _id: recordingID
      }, {
        $set: {"published": false}
    });
  },

  updateProfileInfo: function(description, fullname, genres) {
    if (!this.userId) {
      throw new Meteor.Error("not logged in", "Please login to update profile");
    }

    Meteor.users.update({
        _id: Meteor.userId()
        }, {
          $set: {"bio": description,
                 "fullname": fullname, 
                 "genres": genres
                } 
      });
  },

  updatePhoto: function(photo) {
    if (!this.userId) {
      throw new Meteor.Error("not logged in", "Please login to update profile");
    }

    Meteor.users.update(Meteor.userId(), {$set: photo});
  },

});

RecordingActivity = function(recordingId, user, name, userId) {
  this.recordingId = recordingId;
  this.postedAt = new Date();
  this.postedBy = user;
  this.nameOfActivity = name;
  this.creatorId = userId;
}

// Notification for when one user follows another. For notifying the user being followed
FollowedNotification = function(followerId) {
  this.followerId = followerId;
  this.ttype = "FollowedNotification";
}
