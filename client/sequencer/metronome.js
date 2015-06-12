this.Metronome = (function() {
  function Metronome(audioContext, beatsPerMinute, ticksPerBeat) {
    check(beatsPerMinute, Number);
    check(ticksPerBeat, Number);
    this._audioContext = audioContext;
    this._beatsPerMinute = beatsPerMinute;
    this._ticksPerBeat = ticksPerBeat;
  }

  Metronome.prototype._calcLastTickIndex = function() {
    return Math.floor(this._getCurrentTime() / this._calcSecondsPerTick());
  };

  Metronome.prototype._calcMinutesPerBeat = function() {
    return 1 / this._beatsPerMinute;
  };

  Metronome.prototype._calcNextTickIndex = function() {
    return this._calcLastTickIndex() + 1;
  };

  Metronome.prototype._calcSecondsPerBeat = function() {
    return 60 * this._calcMinutesPerBeat();
  };

  Metronome.prototype._calcSecondsPerTick = function() {
    return this._calcSecondsPerBeat() / this._ticksPerBeat;
  };

  Metronome.prototype._calcTimeAtNextTick = function() {
    return this._calcNextTickIndex() * this._calcSecondsPerTick();
  };

  Metronome.prototype._getCurrentTime = function() {
    return this._audioContext.currentTime;
  };

  Metronome.prototype.getSecondsPerTick = function() {
    return this._calcSecondsPerTick();
  };

  Metronome.prototype.getTimeAtNextTick = function() {
    return this._calcTimeAtNextTick();
  };

  return Metronome;

})();