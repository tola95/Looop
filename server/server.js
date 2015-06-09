var MAX_ACTIVITY_FEED_SIZE = 50;

Meteor.startup(function () {
	if (Sounds.find().count() == 0) {
		populateSounds();
	}
});

// Populates Sounds DB with paths for default instruments
var populateSounds = function() {
  var instruments = ["drum1", "drum2", "grandpiano", "churchorgan"];
  var instrumentSounds = {
    "drum1": ["drums/Kick-01", "drums/Hat-02", "drums/Snr-02", "drums/Hat-03", "drums/Kick-02", 
      "drums/Hat-04", "drums/Snr-03", "drums/OpHat-02", "drums/Kick-03"],

    "drum2": ["drums/Kick-01", "drums/Hat-02", "drums/Snr-04", "drums/Hat-03", "drums/Kick-02", 
      "drums/Hat-04", "drums/Snr-05", "drums/OpHat-03", "drums/Kick-03"],

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

Meteor.publish("sounds", function() {
	if (!Sounds) {
		console.log("Sound not defined yet");
	}
	return Sounds.find();
});

Meteor.publish("recordings", function() {
  return Recordings.find();
});

Meteor.publish("activities", function() {
  return Activities.find();
});

Meteor.publish("userData", function () {
<<<<<<< HEAD
  return Meteor.users.find(
    {_id: this.userId},
    {fields: {'bio': 1, 
              'fullname': 1, 
              'genres': 1, 
              'profilephoto': 1, 
              'following': 1,
              'followers': 1
             }
    }
  );
=======
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'followers': 1, 'following': 1, 'notifications': 1, 'activityFeed': 1, 'seenNotification': 1}});
  } else {
    this.ready();
  }
>>>>>>> af4a8c06817d973aed94577a31fe119189dba5a2
});

Meteor.methods({
  /* Called when the user wants to follow someone.
    followedId: userId of the person the current user wants to follow */
  follow: function(followedId) {
    if (!this.userId) {
      // TODO: login popup
      throw new Meteor.Error("not logged in", "Please log in to follow");
    }
    // console.log(Meteor.users.findOne());
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

  // function for adding the recording to the database when the user finishes recording
  addRecordings: function(recording) {
    Recordings.insert(recording);
  },

  //Assuming that the delete button will only allow the user logged in to delete their recording
  deleteRecording: function(recording) {
    Recordings.remove(recording);
  },

  getRecordings: function(userId) {
    Recordings.find({user: userId}, {sort: {createdAt: -1}}).limit(5);
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
      $pull: {followers: followedId}
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

    // TODO: Get recording out of recording DB - check creator ID (maybe??)

    var activity = new RecordingActivity(recordingId, Meteor.user().username);
    var activityId = Activities.insert(activity);

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
  unpublishRecording: function(recordingId) {
    // TODO: need Recordings DB with activity feed IDs
    return;
  }
});

<<<<<<< HEAD
Meteor.publish("images", function () {
  return Images.find();
});

=======
RecordingActivity = function(recordingId, user) {
  this.recordingId = recordingId;
  this.postedAt = new Date();
  this.postedBy = user;
  this.nameOfActivity = "song";
}

// Notification for when one user follows another. For notifying the user being followed
FollowedNotification = function(followerId) {
  this.followerId = followerId;
  this.ttype = "FollowedNotification";
}
>>>>>>> af4a8c06817d973aed94577a31fe119189dba5a2
