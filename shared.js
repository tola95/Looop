// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

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
			$addToSet: {following: [followedId]}
		});

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