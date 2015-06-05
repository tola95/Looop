AudioControl = function() {
	this.context = new (window.AudioContext || window.webkitAudioContext)();
	this.gainNode = this.context.createGain();
	this.recorder = new Recorder(this.gainNode, {workerPath: "/recorderWorker.js"});
	this.sources = [];
	var recIndex = 0;


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
		this.createDownloadLink();
		this.recorder.clear();

	};

	this.clearRecording = function() {
		this.recorder.clear();
	};
}