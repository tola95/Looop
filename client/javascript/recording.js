Recording = function(name, user, blob){
	this.name = name;
	this.user = user;
	this.blob = blob;
	this.createdAt = new Date();
	this.published = false;
}