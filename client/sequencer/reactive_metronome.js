this.ReactiveMetronome = (function() {
  ReactiveMetronome.prototype._pollsPerTick = 2;

  function ReactiveMetronome(metronome) {
    check(metronome, Metronome);
    this._metronome = metronome;
    this._timeAtNextTickDependency = new Deps.Dependency;
  }

  ReactiveMetronome.prototype._calcMillisecondsPerPoll = function() {
    return this._calcMillisecondsPerTick() / this._pollsPerTick;
  };

  ReactiveMetronome.prototype._calcMillisecondsPerTick = function() {
    return 1000 * this._getSecondsPerTick();
  };

  ReactiveMetronome.prototype._depend = function() {
    if (!Deps.active) {
      return;
    }
    this._timeAtNextTickDependency.depend();
    if (!this._pollId) {
      return this._startPolling();
    }
  };

  ReactiveMetronome.prototype._getSecondsPerTick = function() {
    return this._metronome.getSecondsPerTick();
  };

  ReactiveMetronome.prototype._hasDependents = function() {
    return this._timeAtNextTickDependency.hasDependents();
  };

  ReactiveMetronome.prototype._poll = function() {
    if (this._hasDependents()) {
      return this._updateTimeAtNextTick();
    } else {
      return this._stopPolling();
    }
  };

  ReactiveMetronome.prototype._startPolling = function() {
    var callback;
    callback = _.bind(this._poll, this);
    return this._pollId = Meteor.setInterval(callback, this._calcMillisecondsPerPoll());
  };

  ReactiveMetronome.prototype._stopPolling = function() {
    Meteor.clearInterval(this._pollId);
    return delete this._pollId;
  };

  ReactiveMetronome.prototype._updateTimeAtNextTick = function() {
    var timeAtNextTick;
    timeAtNextTick = this._metronome.getTimeAtNextTick();
    if (timeAtNextTick !== this._timeAtNextTick) {
      this._timeAtNextTick = timeAtNextTick;
      return this._timeAtNextTickDependency.changed();
    }
  };

  ReactiveMetronome.prototype.getTimeAtNextTick = function() {
    this._updateTimeAtNextTick();
    this._depend();
    return this._timeAtNextTick;
  };

  return ReactiveMetronome;

})();