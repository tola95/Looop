Recording = function(name, user, wav){
	this.name = name;
	this.user = user;
	this.wav = wav;
	this.createdAt = new Date();

	this.playRecording = function( buffers ) {
		var newSource = audioContext.createBufferSource();
	    var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
	    newBuffer.getChannelData(0).set(buffers[0]);
	    newBuffer.getChannelData(1).set(buffers[1]);
	    newSource.buffer = newBuffer;

	    newSource.connect( audioContext.destination );
	    newSource.start(0);
	}
}