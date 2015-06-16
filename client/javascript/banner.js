Template.banner.events({
  'click #notifications-wrapper': function() {
    var value = document.getElementById('notif_block').style.display;
    if (value == 'inline-block') {
      document.getElementById('notif_block').style.display = 'none'; 
    }
    else {
      document.getElementById('notif_block').style.display = 'inline-block';
    }
    Meteor.call('updateSeenNotification');
  }
});

Template.banner.helpers({
  notifs: function() {
    var user = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'notifications': 1}});
    if (!user) {
      return [];
    }
    var notifications = user.notifications;
    if(!notifications) {
      return[];
    }
    return notifications;
  },

  no_notifs: function() {
    var user = Meteor.user();
    if (user && user.notifications) {
      return user.notifications.length == 0;
    } else {
      return true;
    }
  },

  seenNotif: function() {
    var seenArr = Meteor.users.findOne({_id: Meteor.userId()}, {fields: {'seenNotification': 1}});
    if (!seenArr) {
      return[];
    } 
    var seen = seenArr.seenNotification; 
    if(!seen) {
      return[];
    }
    return seen;
  },

  currentUserId: function() {
    return Meteor.userId();
  }
});

Template.notifications.helpers({
  typeIs: function(type) {
    return this.ttype == type;
  }
});


Template.search.events({
  'click #searchText': function() {
    document.getElementById('searchText').value = "";
    document.getElementById('results').style.display = "block";
  },

  'keypress': function(event) {
    if (event.keyCode == 13) {
      var name = document.getElementById('searchText').value;
      var user = Meteor.users.findOne({username: name}, {fields: {'_id': 1}});
      var elm = document.getElementById("results");

      var exits = document.getElementById("result_cont");
      var pic = document.getElementById("pic");
      if(exits || pic) {
        exits.parentNode.removeChild(exits);
        pic.parentNode.removeChild(pic);
      }
      createElem(user, elm, name);
    }
  }
});

createElem = function(user, elm, name) {
  var newDiv = document.createElement("div");
  newDiv.id = "result_cont";
  if (!user) {
    newDiv.innerHTML = "No results found!";
    elm.appendChild(newDiv);
    return [];
  } else {
    var userID = user._id;
    if (!userID) {
      return [];
    }
    addPic(userID, elm);
    var att = document.createElement("a");
    att.setAttribute('href',"/user/" + userID);
    att.innerHTML = "" + name;
    att.id = "user";
    newDiv.appendChild(att);
    elm.appendChild(newDiv);
  }
};

addPic = function(userID, elm) {
  var user = Meteor.users.findOne({_id: userID});
  if (user) {
    var img = document.createElement("img");
    img.id = "pic";
    var image = Images.findOne({_id: user.profilePhotoId});
    if (image) {
      img.src = image.url();
    } else {
      img.src = DEFAULT_PROFILE_PHOTO;
    }
    elm.appendChild(img);
  }
}