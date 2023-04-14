export interface Note {
    name: string;
    midi_note: number;
    octave: number;
    frequency: number;
    current_frequency: number;
    playing: boolean;
    hasSharpBefore?: boolean;
}

export const NOTES: Note[] = [{
    name: 'C3',
    midi_note: 1,
    octave: 3,
    frequency: 261.625565300598634,
    current_frequency: 260,
    playing: false
}, {
    name: 'C#',
    midi_note: 1,
    octave: 3,
    frequency: 277.1826,
    current_frequency: 277.1826,
    playing: false
}, {
    name: 'D',
    midi_note: 2,
    octave: 3,
    frequency: 293.664767917407560,
    current_frequency: 260,
    playing: false,
    hasSharpBefore: true
}, {
    name: 'D#',
    midi_note: 1,
    octave: 3,
    frequency: 311.1270,
    current_frequency: 311.1270,
    playing: false
}, {
    name: 'E',
    midi_note: 3,
    octave: 3,
    frequency: 329.627556912869929,
    current_frequency: 260,
    playing: false,
    hasSharpBefore: true
}, {
    name: 'F',
    midi_note: 4,
    octave: 3,
    frequency: 349.228231433003884,
    current_frequency: 260,
    playing: false
}, {
    name: 'F#',
    midi_note: 4,
    octave: 3,
    frequency: 369.9944,
    current_frequency: 369.9944,
    playing: false
}, {
    name: 'G',
    midi_note: 5,
    octave: 3,
    frequency: 391.995435981749294,
    current_frequency: 260,
    playing: false,
    hasSharpBefore: true
}, {
    name: 'G#',
    midi_note: 5,
    octave: 3,
    frequency: 415.3047,
    current_frequency: 415.3047,
    playing: false
}, {
    name: 'A',
    midi_note: 6,
    octave: 3,
    frequency: 440.0000,
    current_frequency: 260,
    playing: false,
    hasSharpBefore: true
}, {
    name: 'A#',
    midi_note: 6,
    octave: 3,
    frequency: 466.1638,
    current_frequency: 466.1638,
    playing: false
}, {
    name: 'H',
    midi_note: 7,
    octave: 3,
    frequency: 493.8833,
    current_frequency: 260,
    playing: false,
    hasSharpBefore: true
}, {
    name: 'C4',
    midi_note: 8,
    octave: 4,
    frequency: 523.2511,
    current_frequency: 260,
    playing: false
}]