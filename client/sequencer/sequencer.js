this.Sequencer = (function() {
  function Sequencer(_ctx) {
    this._ctx = _ctx;
  }

  Sequencer.prototype.createMetronome = function(beatsPerMinute, ticksPerBeat) {
    var metronome;
    metronome = new Metronome(this._ctx, beatsPerMinute, ticksPerBeat);
    return new ReactiveMetronome(metronome);
  };

  return Sequencer;

})();