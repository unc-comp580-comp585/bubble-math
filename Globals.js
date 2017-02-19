var Globals = {};

Globals.gamepad = {};
Globals.leftJSDeadZone = 0.1;

Globals.gamepadEnabled = function(game) {
    return game.input.gamepad.supported &&
           game.input.gamepad.active &&
           Globals.gamepad.connected;
};

Globals.handles = {
    bubble: 'bubble',
    background: 'background',
};

Globals.colors = {
    selected: "#ffff00",
    unselected: "#ffffff",
    popped: "000000",
};

Globals.voices = {
    english: "US English Female",
    spanish: "Spanish Female",
};

Globals.voice = {
    pitch: 1.2,
    rate: 1.1,
};

// Collection of lines for varied text to speech
Globals.speech = {
    correct: [
        "correct",
        "that's right",
        "good job",
        "fantastic",
    ],
    incorrect: [
        "incorrect",
        "try again",
    ],
    victory: [
        "congratulations, you've won",
        "great job, you answered everything right"        
    ],
};

Globals.sounds = {
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
