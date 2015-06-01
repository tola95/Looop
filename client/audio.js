AudioControl = function() {
	this.context = new (window.AudioContext || window.webkitAudioContext)();
	this.gainNode = this.context.createGain();
	this.recorder = new Recorder(this.gainNode, {workerPath: "/recorderWorker.js"});
	this.sources = [];

	var audio_elements = document.getElementsByTagName("AUDIO");
	for (var i=0; i<audio_elements.length; i++) {
		this.sources.push(this.context.createMediaElementSource(audio_elements[i]));
		this.sources[i].connect(this.gainNode);
	};

	this.gainNode.connect(this.context.destination);

	this.record = function() {
		this.recorder.record();
	};

	this.stopRecording = function() {
		this.recorder.stop();
		var control = this;
		this.recorder.getBuffer(function(buffers) {
			var newSource = control.context.createBufferSource();
		    var newBuffer = control.context.createBuffer( 2, buffers[0].length, control.context.sampleRate );
		    newBuffer.getChannelData(0).set(buffers[0]);
		    newBuffer.getChannelData(1).set(buffers[1]);
		    newSource.buffer = newBuffer;

		    newSource.connect( control.context.destination );
		    newSource.start(0);
		});
	};

	this.clearRecording = function() {
		this.recorder.clear();
	};

}
