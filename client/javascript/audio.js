AudioControl = function() {
	this.context = new (window.AudioContext || window.webkitAudioContext)();
	this.gainNode = this.context.createGain();
	this.recorder = new Recorder(this.gainNode, {workerPath: "/recorderWorker.js"});
	this.sources = [];
	this.clonedSources = [];
	this.drumSources = [];
	this.keySources = [];
	var recIndex = 0;

	this.gainNode.connect(this.context.destination);

	this.record = function() {
		this.recorder.record();
	};

	this.stopRecording = function() {
		this.recorder.stop();
	};

	this.clearRecording = function() {
		this.recorder.clear();
		while (this.clonedSources.length != 0) {
			this.clonedSources.pop().disconnect();
		}
	};

	this.addSource = function(audioElem) {
		var audioNode = this.context.createMediaElementSource(audioElem);
		this.clonedSources.push(audioNode);
		audioNode.connect(this.gainNode);
	};

	// Plays back the last recording (if not cleared)
	this.playback = function() {
		var audioContext = this.context;
		this.recorder.getBuffer(function(buffers) {
		    var newSource = audioContext.createBufferSource();
		    var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
		    newBuffer.getChannelData(0).set(buffers[0]);
		    newBuffer.getChannelData(1).set(buffers[1]);
		    newSource.buffer = newBuffer;

		    newSource.connect( audioContext.destination );
		    newSource.start(0);
		});
	};

	this.addAudioSources = function() {
		var audio_elements = document.getElementsByTagName("AUDIO");
		for (var i=0; i<audio_elements.length; i++) {
			this.sources.push(this.context.createMediaElementSource(audio_elements[i]));
			this.sources[i].connect(this.gainNode);
		};
	};

	this.playRecording = function( buffers ) {
	  var newSource = this.context.createBufferSource();
	  var newBuffer = this.context.createBuffer( 2, buffers[0].length, this.context.sampleRate );
	  newBuffer.getChannelData(0).set(buffers[0]);
	  newBuffer.getChannelData(1).set(buffers[1]);
	  newSource.buffer = newBuffer;
	  newSource.connect( this.context.destination );
	  newSource.start(0);
	}
}