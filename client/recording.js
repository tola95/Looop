Recording = function(name, user, blob, audioContext){
	this.name = name;
	this.user = user;
	this.blob = blob;
	this.createdAt = new Date();

	this.getBufferCallback = function () {
	    var newSource = audioContext.createBufferSource();
	    var newBuffer = audioContext.createBuffer( 2, this.blob[0].length, audioContext.sampleRate );
	    newBuffer.getChannelData(0).set(this.blob[0]);
	    newBuffer.getChannelData(1).set(this.blob[1]);
	    newSource.buffer = newBuffer;

	    newSource.connect( audioContext.destination );
	    newSource.start(0);
	}
}