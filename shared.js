var MAX_ACTIVITY_FEED_SIZE = 50;

// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

// Database containing Activity objects that are used to populate a user's activity feed
Activities = new Mongo.Collection("activities");

// Database containing Recorded objects by users
Recordings = new Mongo.Collection("recordings");

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

		// Notify followerId
		Meteor.call("addNotification", followedId, new FollowedNotification(this.userId));
	},

	// function for adding the recording to the database when the user finishes recording
	record: function() {
		Recordings.insert({
			createdBy: this.userId,
			createdAt: new Date(),
			// title: text;
		});
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

	// Adds given notification to the notifications list of the user with ID notifiedUserId
	addNotification: function(notifiedUserId, notification) {
		Meteor.users.update({
			_id: notifiedUserId
		}, {
			$addToSet: {notifications: notification}
		});
	},

	getActivityFeed: function(user, callback) {
		var u = Meteor.users.findOne({_id: user}, {fields: {'activityFeed': 1}});
		// console.log(u);
		return u;
	},



	// getActivityFeed: function(userId) {
	// 	var acts = Meteor.users.findOne({_id: userId}, {activityFeed: 1}).activityFeed;
	// 	console.log("Acts" + acts);
	// 	return acts;
	// },

	// Publishes the recording to the current user's followers by adding it to the followers' feeds
	publishRecording: function(recordingId) {
		if (!this.userId) {
			throw new Meteor.Error("not logged in", "Please login to publish a recording");
		}

		// TODO: Get recording out of recording DB - check creator ID (maybe??)

		var activity = new RecordingActivity(recordingId, Meteor.user().username);
		var activityId = Activities.insert({
			activity: activity,
		});

		var followers = Meteor.users.findOne({_id: this.userId}).followers;
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
	},

	// Deletes the Activity associated with the recording
	unpublishRecording: function(recordingId) {
		// TODO: need Recordings DB with activity feed IDs
		return;
	}
});


// Notification for when one user follows another. For notifying the user being followed
FollowedNotification = function(followerId) {
	this.followerId = followerId;
}

RecordingActivity = function(recordingId, user) {
	this.recordingId = recordingId;
	this.postedAt = new Date();
	this.postedBy = user;
	this.nameOfActivity = "song";
}