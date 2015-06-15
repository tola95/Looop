Meteor.subscribe("activities");

Template.activity.helpers({

	activities: function () {
		var activities = [];
		var userDoc = Meteor.user()
		if (!userDoc) {
			return [];
		}
		var activityFeed = userDoc.activityFeed;
		if (!activityFeed) {
			return [];
		}
		for (var i = 0; i < activityFeed.length; i ++) {
			var act = Activities.findOne({_id: activityFeed[i]});
			activities.push(act);
		}

		return activities;
	}
});

Template.ownRecordingCard.events({
	'click .publish-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		Meteor.call("publishRecording", recordingId);
	},

	'click .unpublish-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		console.log(recordingId);
		Meteor.call("unpublishRecording", recordingId);
	},

	'click .delete-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		console.log(recordingId);
		Meteor.call("deleteRecording", recordingId);
	}
});


Template.recordingCardContents.helpers({
	profile_image: function() {
		var user = Meteor.users.findOne({_id: getProfileId()});
		if (user) {
			return user.profilePhoto;
		}
	}
});

Template.activityCard.helpers({
	profile_image: function() {
		var userId = Template.instance().data.creatorId;
		var user = Meteor.users.findOne({_id: userId});
		if (user) {
			return user.profilePhoto;
		}
	}
});