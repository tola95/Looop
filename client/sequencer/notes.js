var AbstractPitch, NOTE_REGEX, REFERENCE_NOTE, SEMITONES_FROM_C, SEMITONES_PER_OCTAVE, SEMITONES_TO_NAMES, TWELTH_ROOT_OF_TWO,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

this.Note = (function() {
  function Note(duration, pitch) {
    check(duration, Duration);
    check(pitch, Match.Optional(Match.OneOf(AbstractPitch, RelativePitch)));
    this._duration = duration;
    this._pitch = pitch;
  }

  Note.prototype.isPitched = function() {
    return this._pitch != null;
  };

  Note.prototype.isRest = function() {
    return !this.isPitched();
  };

  Note.prototype.getFrequency = function() {
    return this._pitch.getFrequency();
  };

  Note.prototype.getNumBeats = function() {
    return this._duration.getNumBeats();
  };

  Note.prototype.schedule = function(bpm, start) {
    check(bpm, Number);
    check(start, Number);
    return new ScheduledNote(this._duration, this._pitch, bpm, start);
  };

  return Note;

})();

this.ScheduledNote = (function(superClass) {
  extend(ScheduledNote, superClass);

  function ScheduledNote(beats, pitch, bpm, start) {
    check(bpm, Number);
    check(start, Number);
    ScheduledNote.__super__.constructor.call(this, beats, pitch);
    this._bpm = bpm;
    this._start = start;
  }

  ScheduledNote.prototype.getStart = function() {
    return this._start;
  };

  ScheduledNote.prototype.getDuration = function() {
    return this.getNumBeats() * 60 / this._bpm;
  };

  ScheduledNote.prototype.transpose = function(semitones) {
    var newPitch;
    if (this.isPitched()) {
      newPitch = this._pitch.transpose(semitones);
    }
    return new ScheduledNote(this._duration, newPitch, this._bpm, this._start);
  };

  return ScheduledNote;

})(Note);

SEMITONES_FROM_C = {
  'cb': 11,
  'c': 0,
  'c#': 1,
  'db': 1,
  'd': 2,
  'd#': 3,
  'eb': 3,
  'e': 4,
  'e#': 5,
  'fb': 4,
  'f': 5,
  'f#': 6,
  'gb': 6,
  'g': 7,
  'g#': 8,
  'ab': 8,
  'a': 9,
  'a#': 10,
  'bb': 10,
  'b': 11,
  'b#': 12
};

SEMITONES_TO_NAMES = {
  0: 'c',
  1: 'c#',
  2: 'd',
  3: 'd#',
  4: 'e',
  5: 'f',
  6: 'f#',
  7: 'g',
  8: 'g#',
  9: 'a',
  10: 'a#',
  11: 'b'
};

SEMITONES_PER_OCTAVE = 12;

TWELTH_ROOT_OF_TWO = Math.pow(2, 1 / 12);

AbstractPitch = (function() {
  function AbstractPitch(name, octave) {
    check(name, String);
    check(octave, Number);
    this._name = name;
    this._octave = octave;
  }

  AbstractPitch.prototype._getSemitonesFromC = function() {
    return SEMITONES_FROM_C[this.getName()];
  };

  AbstractPitch.prototype.getName = function() {
    return this._name;
  };

  AbstractPitch.prototype.getNoteNumber = function() {
    return this.getOctave() * SEMITONES_PER_OCTAVE + this._getSemitonesFromC();
  };

  AbstractPitch.prototype.getOctave = function() {
    return this._octave;
  };

  AbstractPitch.prototype.toString = function() {
    return "" + (this.getName()) + (this.getOctave()) + " (" + (this.getFrequency()) + ")";
  };

  AbstractPitch.prototype.getFrequency = function() {
    throw 'Subclass must implement getFrequency() but does not.';
  };

  return AbstractPitch;

})();

this.AbsolutePitch = (function(superClass) {
  extend(AbsolutePitch, superClass);

  function AbsolutePitch(name, octave, frequency) {
    check(frequency, Number);
    AbsolutePitch.__super__.constructor.call(this, name, octave);
    this._frequency = frequency;
  }

  AbsolutePitch.prototype.getFrequency = function() {
    return this._frequency;
  };

  return AbsolutePitch;

})(AbstractPitch);

this.RelativePitch = (function(superClass) {
  extend(RelativePitch, superClass);

  function RelativePitch(name, octave, reference) {
    check(reference, AbsolutePitch);
    RelativePitch.__super__.constructor.call(this, name, octave);
    this._reference = reference;
  }

  RelativePitch.prototype._getSemitonesFromReference = function() {
    return this.getNoteNumber() - this._reference.getNoteNumber();
  };

  RelativePitch.prototype._noteNumberToNameOctave = function(noteNumber) {
    var modable, name, octave;
    modable = noteNumber < 0 ? SEMITONES_PER_OCTAVE - noteNumber : noteNumber;
    name = SEMITONES_TO_NAMES[modable % SEMITONES_PER_OCTAVE];
    octave = Math.floor(noteNumber / SEMITONES_PER_OCTAVE);
    return [name, octave];
  };

  RelativePitch.prototype.getFrequency = function() {
    var an, f0;
    f0 = this._reference.getFrequency();
    an = Math.pow(TWELTH_ROOT_OF_TWO, this._getSemitonesFromReference());
    return f0 * an;
  };

  RelativePitch.prototype.transpose = function(semitones) {
    var name, newNoteNumber, octave, ref;
    newNoteNumber = this.getNoteNumber() + semitones;
    ref = this._noteNumberToNameOctave(newNoteNumber), name = ref[0], octave = ref[1];
    return new RelativePitch(name, octave, this._reference);
  };

  return RelativePitch;

})(AbstractPitch);

this.Duration = (function() {
  function Duration(numerator, denominator) {
    check(numerator, Number);
    check(denominator, Number);
    this._numerator = numerator;
    this._denominator = denominator;
  }

  Duration.prototype.getNumBeats = function() {
    return this._numerator / this._denominator;
  };

  return Duration;

})();

NOTE_REGEX = /(?:([a-g][b#]?)([0-8])|r)(?:_(\d+)(?:\/(\d+))?)?/i;

REFERENCE_NOTE = new AbsolutePitch('a', 4, 400);

this.NoteParser = (function() {
  function NoteParser() {}

  NoteParser.parse = function(note) {
    var duration, getInt, match, name, pitch, ref;
    match = note.match(NOTE_REGEX);
    if (!match) {
      throw "Invalid note: " + note;
    }
    getInt = function(group) {
      return parseInt(match[group] || 1);
    };
    name = (ref = match[1]) != null ? ref.toLowerCase() : void 0;
    duration = new Duration(getInt(3), getInt(4));
    if (name != null) {
      pitch = new RelativePitch(name, getInt(2), REFERENCE_NOTE);
    }
    return new Note(duration, pitch);
  };

  return NoteParser;

})();

this.AbcNoteParser = (function() {
  function AbcNoteParser(_noteLength) {
    this._noteLength = _noteLength;
  }

  AbcNoteParser.prototype.parse = function(abcNote) {
    var accidental, duration, noteName, octave, pitch;
    if (abcNote.note !== 'rest') {
      noteName = abcNote.note[0].toLowerCase();
      if (abcNote.note.length === 1) {
        octave = abcNote.note === noteName ? 5 : 4;
      } else {
        octave = abcNote.note[2] === ',' ? 3 : 6;
      }
      if ((accidental = abcNote.accidental) != null) {
        if (accidental === 'sharp') {
          noteName = noteName + "#";
        } else if (accidental === 'flat') {
          noteName = noteName + "b";
        } else {
          throw "Unknown accidental: " + accidental;
        }
      }
      if (noteName != null) {
        pitch = new RelativePitch(noteName, octave, REFERENCE_NOTE);
      }
    }
    duration = new Duration(abcNote.duration, this._noteLength);
    return new Note(duration, pitch);
  };

  return AbcNoteParser;

})();