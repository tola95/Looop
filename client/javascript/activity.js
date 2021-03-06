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
			if (act) {
				activities.unshift(act);
			}
		}

		return activities;
	}
});

Template.ownRecordingCard.events({
	'click .publish-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		if(recordingId == "") {
			recordingId = event.target.parentNode.parentNode.parentNode.id;
		}
		Meteor.call("publishRecording", recordingId);
	},

	'click .unpublish-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		Meteor.call("unpublishRecording", recordingId);
	},

	'click .delete-button': function(event) {
		var recordingId = event.target.parentNode.parentNode.id;
		if(recordingId == "") {
			recordingId = event.target.parentNode.parentNode.parentNode.id;
		}
		Meteor.call("deleteRecording", recordingId);
	}
});

Template.recordingCardContents.events({
	'click .play': function(event) {
    	var inputId = event.target.id;
    	if (Meteor.userId() != null){
      		var qRec = Recordings.findOne({_id:inputId});
      		if (qRec) {
	      		var newFloat32Buffer = [new Float32Array(qRec.blob[0].buffer), new Float32Array(qRec.blob[1].buffer)];
	      		playRecording(newFloat32Buffer);
	      	} else {
	      		alert("Sorry, this recording has been deleted");
	      	}
      	}
	}
});

Template.recordingCardContents.helpers({
	profile_image: function() {
		var user = Meteor.users.findOne({_id: getProfileId()});
		if (user) {
			var image = Images.findOne({_id: user.profilePhotoId});
	      if (image) {
	        return image.url();
	      } else {
	        return DEFAULT_PROFILE_PHOTO;
      }
		}
	}
});

Template.activityCard.helpers({
	profile_image: function() {
		var userId = Template.instance().data.creatorId;
		var user = Meteor.users.findOne({_id: userId});
		if (user) {
			var image = Images.findOne({_id: user.profilePhotoId});
			if (image) {
				return image.url();
			} else {
				return DEFAULT_PROFILE_PHOTO;
			}
		}
	}
});

Template.activityCard.events({
	'click .play': function(event) {
    	var inputId = event.target.id;
    	if (Meteor.userId() != null){
      		var qRec = Recordings.findOne({_id:inputId});
      		if (qRec) {
	      		var newFloat32Buffer = [new Float32Array(qRec.blob[0].buffer), new Float32Array(qRec.blob[1].buffer)];
	      		playRecording(newFloat32Buffer);
	      	} else {
	      		alert("Sorry, this recording has been deleted");
	      	}
      	}
	}
});