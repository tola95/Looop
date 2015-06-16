// Database to hold the various available sounds
Sounds = new Mongo.Collection("sounds");

// Database containing Activity objects that are used to populate a user's activity feed
Activities = new Mongo.Collection("activities");

// Database containing Recorded objects by users
Recordings = new Mongo.Collection("recordings");

// Database to store profile and cover photos
var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStore]
});

Images.deny({
	insert: function(){
	 	return false;
	},
	update: function(){
	 	return false;
	},
	remove: function(){
	 	return false;
	},
	download: function(){
		return false;
	}
 });

Images.allow({
	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	},
	download: function(){
		return true;
 }
});