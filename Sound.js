var Sound = {};

// loads all of the sounds into a game instance
Sound.loadSounds = function(game, game_sounds){
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
Sound.addSounds = function(game, game_sounds){
    for(var sound in Globals.sounds){
        for(var s in Globals.sounds[sound]){
            let len = game_sounds[sound].push(
                game.add.audio(Globals.sounds[sound][s].handle)
            );
            // Volume adjustment
            if(sound == 'bubbles'){
                game_sounds[sound][len-1].volume = 0.4;
            } else if (sound == 'wrong'){
                game_sounds[sound][len-1].volume = 0.3;
            } else if (sound == 'win'){
                game_sounds[sound][len-1].volume = 0.3;
            }
        }
    }
};

// plays randomly selected sound from input category
Sound.play = function(game_sounds, input){
    if (Globals.soundfx){
        if (input == 'pop' || input == 'bubbles' || input == 'wrong' || input == 'win')
        {
            (game_sounds[input][
                Math.floor(Math.random() * game_sounds[input].length)
            ]).play();
        }
        else{
            return;
        }
    }
    return;
};

// Dictates input string aloud with voice settings defined in Globals
Sound.read = function(input){
    // Web speech api
    if (Globals.dictation){
        window.speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance(input);
        msg.volume = Globals.voice.volume;
        msg.rate = Globals.voice.rate;
        msg.pitch = Globals.voice.pitch;
        msg.lang = Globals.voice.lang;
        window.speechSynthesis.speak(msg);
    }
};

// Dictates an equation, replacing '-' with 'minus', etc.
Sound.readEquation = function(input){
    input = String(input).replace('-', 'minus');
    input = String(input).replace('/', 'divided by');
    input = String(input).replace('*', 'times');
    Sound.read(input);
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

// Increases/decreases speech rate
Sound.speechRate = function(input){
    if (input.event.key == "a"){
        Globals.voice.rate += 0.2;
        console.log("Speech rate increased");
    } 
    else if (input.event.key == "s"){
        Globals.voice.rate -= 0.2;
        console.log("Speech rate decreased");
    }
};

Sound.initRecognition = function(recognition){
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    var numbers = [];
    for (var i = 0; i < 30; i++){
        numbers.push(String(i));
    } 
    var grammar = '#JSGF V1.0; grammar numbers; public <number> = ' + numbers.join(' | ') + ' ;'
    recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = Globals.recognition.lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
}

// Starts speech recognition instance to answer current question
Sound.startRecognition = function(recognition){
    console.log('Listening...');
    console.dir(recognition);
    recognition.start();
};