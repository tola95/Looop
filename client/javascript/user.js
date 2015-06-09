Meteor.subscribe("userData", function () {
    if (Meteor.userId()) {
      var bio = Meteor.users.findOne({_id: Meteor.userId()}).bio;
      var fullname = Meteor.users.findOne({_id: Meteor.userId()}).fullname;
      var genres = Meteor.users.findOne({_id: Meteor.userId()}).genres;
      var followers = 0;
      var following = 0;
      
      if (bio) {
        document.getElementById('description').innerHTML = bio;
      }
      if (fullname) {
        document.getElementById('fullname').innerHTML = fullname;
      }
      if (genres) {
        document.getElementById('genres').innerHTML = genres;
      }
        document.getElementById('nooffollowers').innerHTML = followers;
        document.getElementById('nooffollowing').innerHTML = following;
    }
});


Template.usermain.events = {
   'click #timelinebutton' : function() {
      document.getElementById('recordings').style.display = "none";
      document.getElementById('timeline').style.display = "block";
   },

   'click #recordingsbutton' : function() {
      document.getElementById('recordings').style.display = "block";
      document.getElementById('timeline').style.display = "none";
   }
};

Template.details.events = {
  'click #update' : function() {

    var description = document.getElementById("desc_text").value;
    var fullname = document.getElementById("fname_text").value;
    var genres = document.getElementById("genres_text").value;

    if (Meteor.userId()) {
      Meteor.users.update({
        _id: Meteor.userId()
        }, {
          $set: {"bio": description,
                 "fullname": fullname, 
                 "genres": genres
                } 
      })
    }

    document.getElementById('description').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).bio;
    document.getElementById('fullname').innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).fullname;
    document.getElementById("genres").innerHTML = Meteor.users.findOne({_id: Meteor.userId()}).genres;

    document.getElementById("desc_text").value = "";
    document.getElementById("fname_text").value = "";
  },


  'change #addProfilePic' : function(event, template) {
    var files = event.target.files;
    for (var i = 0, ln = files.length; i < ln; i++) {
      Images.insert(files[i], function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if (err) {
          console.log(err);
        } else {
          console.log(fileObj);
        }
      });
    }
  }
  
};