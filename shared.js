// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

// Database containing Activity objects that are used to populate a user's activity feed
Activities = new Mongo.Collection("activities");

// Database containing Recorded objects by users
Recordings = new Mongo.Collection("recordings");

// Notification for when one user follows another. For notifying the user being followed
FollowedNotification = function(followerId) {
	this.followerId = followerId;
}