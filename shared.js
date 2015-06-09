// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

// Database containing Activity objects that are used to populate a user's activity feed
Activities = new Mongo.Collection("activities");

<<<<<<< HEAD
		Meteor.users.update({
			_id: followedId
			}, {
			$addToSet: {followers: [this.userId]}
		});

		// Notify followerId
		Meteor.call("addNotification", followedId, new FollowedNotification(this.userId));
	},

	/* Called when the current user wants to unfollow the user with id followedId */
	unfollow: function(followedId) {
		Meteor.users.update({
			_id: this.userId
			}, {
			$pull: {following: [followedId]}
		});

		Meteor.users.update({
			_id: followedId
			}, {
			$pull: {followers: [followedId]}
		});
	},

	addNotification: function(notifiedUserId, notification) {
		Meteor.users.update({
			_id: notifiedUserId
		}, {
			$addToSet: {notifications: [notification]}
		});
	}
});


// Notification for when one user follows another. For notifying the user being followed
FollowedNotification = function(followerId) {
	this.followerId = followerId;
};

var Images = new FS.Collection("images", {
    stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
  });
=======
// Database containing Recorded objects by users
Recordings = new Mongo.Collection("recordings");
>>>>>>> af4a8c06817d973aed94577a31fe119189dba5a2
