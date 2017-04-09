var Globals = {};

Globals.game = {};

Globals.gamepad = {};
Globals.leftJSDeadZone = 0.1;

Globals.gamepadEnabled = function(game) {
    return game.input.gamepad.supported &&
           game.input.gamepad.active &&
           Globals.gamepad.connected;
};

/*
 * User controlled game options
 */

// Game mode [0-1]
Globals.game_mode = 0;

// Difficulty of game [0-2]
Globals.difficulty = 2;

// Grade in school [1-4]
Globals.grade = 1;

/*
 * Graphical options
 */

Globals.handles = {
    bubble: 'bubble',
    bunny: 'usagi-chan',
    background: 'background',
    wand: 'wand',

    bubble_popping: 'bubble_popping',
    bunny_jumping: 'usagi-chan_jumping',
};

Globals.animations = {
    pop: 'pop',
    jump: 'jump',
};

Globals.colors = {
    selected: "#ffff00",    // Yellow
    unselected: "#ffffff",  // White
    popped: "#000000",      // Black
    chosen: "#00ff00",      // Green
};

/*
 * Sound effect, speech synthesis, and voice recognition options
 */

// Enable/Disable background music
Globals.music = true;

// Enable/Disable speech synthesis
Globals.dictation = true;

// Enable/Disable all sound effects
Globals.soundfx = true;

// Speech recognition options and locales
Globals.recognition = {
    lang: 'en',
    locales: ['en', 'es', 'it', 'zh', 'de'],
};

// Spoken numbers less then 4 in all supported languages
Globals.numbers = {
    "zero":0,
    "one": 1,
    "two": 2,
    "three": 3,
    "cero": 0,
    "uno": 1,
    "dos": 2,
    "tres": 3,
    "un": 1,
    "deux": 2,
    "trois": 3,
    "due": 2,
    "tre": 3,
    "null": 0,
    "eins": 1,
    "zwei": 2,
    "zwo" : 2,
    "drei": 3,
    "ling": 0,
    "yi": 1,
    "er": 2,
    "liang": 2,
    "san": 3,
};

// Speech synthesis (tts) options
Globals.voice = {
    volume: 1.0,
    rate: 2.0,
    pitch: 1.1,
    lang: 'en-US',
};

// Collection of strings for speech synthesis
Globals.speech = {
    correct: [
        "correct",
        // "good job",
        // "fantastic",
    ],
    incorrect: [
        "incorrect",
        // "try again",
    ],
    victory: [
        // "congratulations, you finished",
        "great job, you answered everything right"
    ],
};

Globals.game_sounds = {};

// Sound effects
Globals.sounds = {
    music: {
        bgm: {
            handle: 'bgm',
            path: 'assets/audio/8bit_bg.wav',
        },
    },
    pop: {
        pop_1: {
            handle: 'pop_1',
            path: 'assets/audio/bubble-pop-1.mp3',
        },
        pop_2: {
            handle: 'pop_2',
            path: 'assets/audio/bubble-pop-2.mp3',
        },
        pop_3: {
            handle: 'pop_3',
            path: 'assets/audio/bubble-pop-3.mp3',
        },
    },
    bubbles: {
        short_1: {
            handle: 'short_1',
            path: 'assets/audio/short-bubbles-1.mp3',
        },
        short_2: {
            handle: 'short_2',
            path: 'assets/audio/short-bubbles-2.mp3',
        },
        short_3: {
            handle: 'short_3',
            path: 'assets/audio/short-bubbles-3.mp3',
        },
        short_4: {
            handle: 'short_4',
            path: 'assets/audio/short-bubbles-4.mp3',
        },
    },
    wrong: {
        wrong_1: {
            handle: 'wrong_1',
            path: 'assets/audio/wrong-1.mp3',
        },
        // wrong_2: {
        //     handle: 'wrong_2',
        //     path: 'assets/audio/wrong-2.mp3',
        // },
        // wrong_3: {
        //     handle: 'wrong_3',
        //     path: 'assets/audio/wrong-3.mp3',
        // },
        // wrong_4: {
        //     handle: 'wrong_4',
        //     path: 'assets/audio/wrong-4.mp3',
        // },
    },
    win: {
        win_1: {
            handle: 'win_1',
            path: 'assets/audio/achievement.mp3',
        },
    },
};
