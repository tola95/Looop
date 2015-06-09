Meteor.subscribe("activities");

Template.activity.helpers({

	activities: function () {
		var activities = [];
		var userDoc = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'activityFeed': 1}});
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

		console.log("activities: " + activities);
		return activities;
	}
});

