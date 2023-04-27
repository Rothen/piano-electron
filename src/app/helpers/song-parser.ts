import { NOTES } from './note';
import { NoteGroups } from './note-groups';
import { Song } from './song';
import { SongNote } from './song-note';

export class SongParser {
    /*eslint max-len: ["error", { "code": 800 }]*/
    private static noteRegex = /^(?<length>\d+)(?<halfNote>b|\#)?(?<note>P|C|D|E|F|G|A|H)(?<longer>\.)?(?<negativeOctave>-)?(?<octave>\d+)?(?<tie>,)?$/;

    public static parseSongNotes(song: Song): SongNote[][] {
        const songNotes: SongNote[][] = song.notes.map(songNoteStr => songNoteStr.split(';').map(noteStr => {
            const matches: NoteGroups = noteStr.match(SongParser.noteRegex).groups as any as NoteGroups;
            const length = parseInt(matches.length, 10);
            let tact = 1 / length;

            if (matches.longer) {
                tact *= 1.5;
            }

            if (matches.note === 'P') {
                return {
                    tact,
                    realTact: tact,
                    noteIndex: null,
                    octave: null,
                    tie: false,
                    releaseSongNote: null
                };
            }

            let octave = song.baseOctave - 2;
            let octaveModifier = (matches.octave) ? parseInt(matches.octave, 10) : 0;
            if (matches.negativeOctave) {
                octaveModifier *= -1;
            }
            octave += octaveModifier;

            let lower = false;
            let higher = false;

            if (matches.halfNote === 'b') {
                lower = true;
            } else if (matches.halfNote === '#') {
                higher = true;
            }

            let noteIndex = NOTES.findIndex(note => note.name === matches.note);

            if (lower) {
                if (noteIndex === 0) {
                    octave -= 1;
                    noteIndex = NOTES.length - 1;
                } else {
                    noteIndex--;
                }
            } else if (higher) {
                if (noteIndex === NOTES.length - 1) {
                    octave += 1;
                    noteIndex = 0;
                } else {
                    noteIndex++;
                }
            }

            let tie = false;
            if (matches.tie) {
                tie = true;
            }

            return {
                tact,
                realTact: tact,
                noteIndex,
                octave,
                tie,
                releaseSongNote: null
            };
        }));

        songNotes.forEach(songNoteList => SongParser.handleTies(songNoteList));

        return songNotes;
    }

    private static handleTies(songNotes: SongNote[]): void {
        for (let i = 0; i < songNotes.length; i++) {
            const songNote = songNotes[i];
            if (songNote.tie) {
                SongParser.handleTie(songNotes, songNote, i);
            }
        }
    }

    private static handleTie(songNotes: SongNote[], songNote: SongNote, index: number): void {
        const { foundTie, foundTieIndex, tactSum } = SongParser.getTieSongNote(songNotes, songNote, index);

        if (foundTie) {
            SongParser.makeTie(songNotes, songNote, foundTie, foundTieIndex, tactSum);
        }
    }

    private static getTieSongNote(songNotes: SongNote[], songNote: SongNote, index: number): { foundTie: SongNote; foundTieIndex: number; tactSum: number } {
        let foundTie: SongNote = null;
        let foundTieIndex = -1;
        let tactSum = songNote.realTact;
        for (let j = index + 1; j < songNotes.length; j++) {
            const tieSongNote = songNotes[j];
            tactSum += tieSongNote.realTact;
            if (tieSongNote.noteIndex === songNote.noteIndex && tieSongNote.octave === songNote.octave) {
                foundTie = tieSongNote;
                foundTieIndex = j;
                break;
            }
        }
        return {
            foundTie,
            foundTieIndex,
            tactSum
        };
    }

    private static makeTie(songNotes: SongNote[], songNote: SongNote, tie: SongNote, tieIndex: number, sum: number): void {
        songNote.tact = sum;
        tie.noteIndex = null;
        tie.octave = null;
        tie.tie = false;
        tie.releaseSongNote = null;
        if (tieIndex + 1 < songNotes.length) {
            songNotes[tieIndex + 1].releaseSongNote = songNote;
        } else {
            songNotes.push({
                tact: 0.01,
                realTact: 0.01,
                noteIndex: null,
                octave: null,
                tie: false,
                releaseSongNote: null
            });
        }
    }
}
