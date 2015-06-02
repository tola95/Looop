// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

Meteor.methods({
	/* Called when the user wants to follow someone.
		followedId: userId of the person the current user wants to follow */
	addFollowing: function(followedId) {
		if (!this.userId) {
			// TODO: login popup
			throw new Meteor.Error("not logged in", "Please log in to follow");
		}
		Meteor.users.update({
			_id: this.userId
			}, {
			$addToSet: {pendingFollowing: [followedId]}
		});

		// Notify followerId
		Meteor.call("addNotification", followedId, new FollowedNotification(this.userId));
	},

	addNotification: function(notifiedUserId, notification) {
		console.log("add notification to userID " + notifiedUserId);

		Meteor.users.update({
			_id: notifiedUserId
		}, {
			$addToSet: {notifications: [notification]}
		});
	},

	acceptFollower: function(followerId) {
		if (Meteor.users.find({_id: followerId}).length == 0) {
			throw new Meteor.Error("Accepting nonexistant user");
		}

		Meteor.users.update({
			_id: followerId
		}, {
			$addToSet: {following: [this.userId]},
			$pull: {pendingFollowing: [this.userId]}
		});

		Meteor.users.update({
			_id: this.userId
		}, {
			$addToSet: {followedBy: [followerId]}
		});
	},

	declineFollower: function(followerId) {
		Meteor.users.update({
			_id: followerId
		}, {
			$pull: {pendingFollowing: [this.userId]}
		});
	}
});


// Notification for when one user follows another. For notifying the user being followed that there was a request
FollowedNotification = function(followerId) {
	this.followerId = followerId;

	this.accept = function() {
		Meteor.call("acceptFollower", followerId);
	};

	this.decline = function() {
		Meteor.call("declineFollower", followerId);
	};
}