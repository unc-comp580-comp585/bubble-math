var Sound = {};

// loads all of the sounds into a game instance
Sound.load_sounds = function(game, game_sounds){
    for(var sound in Globals.sounds){
        for(var s in Globals.sounds[sound]){
            game.load.audio(
                Globals.sounds[sound][s].handle,
                Globals.sounds[sound][s].path
            );
        }
        game_sounds[sound] = [];
    }
};

// adds the loaded sounds to a game instance
Sound.add_sounds = function(game, game_sounds){
    for(var sound in Globals.sounds){
        for(var s in Globals.sounds[sound]){
            let len = game_sounds[sound].push(
                game.add.audio(Globals.sounds[sound][s].handle)
            );
            // Volume adjustment
            if(sound == 'bubbles'){
                game_sounds[sound][len-1].volume = 0.4;
            } else if (sound == 'wrong'){
                game_sounds[sound][len-1].volume = 0.2;
            } else if (sound == 'win'){
                game_sounds[sound][len-1].volume = 0.3;
            }
        }
    }
};

// plays randomly selected sound from input category
Sound.play = function(game_sounds, input){
    if (input == 'pop' || input == 'bubbles' || input == 'wrong' || input == 'win')
    {
        (game_sounds[input][
            Math.floor(Math.random() * game_sounds[input].length)
        ]).play();
    }
    else{
        return;
    }
};

// Dictates input string aloud with voice settings defined in Globals
Sound.read = function(input){
    responsiveVoice.speak(input, Globals.voices.english, {
        pitch: Globals.voice.pitch,
        rate: Globals.voice.rate
    });
};

// Dictates a randomly selected string from input category
Sound.dictate = function(input){
    var string_to_read;
    if (input == 'correct')
    {
        string_to_read = Globals.speech.correct[
            Math.floor(Math.random() * Globals.speech.correct.length)
        ];
    }
    else if (input == 'incorrect')
    {
        string_to_read = Globals.speech.incorrect[
            Math.floor(Math.random() * Globals.speech.incorrect.length)
        ];
    }
    else if (input == 'victory')
    {
        string_to_read = Globals.speech.victory[
            Math.floor(Math.random() * Globals.speech.victory.length)
        ];
    }
    else
    {
        return;
    }
    Sound.read(string_to_read);
};