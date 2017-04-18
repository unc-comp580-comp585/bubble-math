var SpRecog = {};

SpRecog.init = function(recognition){
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
SpRecog.listen = function(recognition){
    console.log('Listening...');
    console.dir(recognition);
    recognition.start();
};