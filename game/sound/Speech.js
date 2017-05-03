var Speech = {
    read: function(input, options) {
        // Web speech api
        clearTimeouts();
        window.speechSynthesis.cancel();
        Globals.speech_lock = false;
        input = input.replace(new RegExp('-', 'g'), 'minus');
        input = input.replace(new RegExp('/', 'g'), 'divided by');
        input = input.replace(new RegExp('÷', 'g'), 'divided by');
        input = input.replace(new RegExp('\\*', 'g'), 'times');
        input = input.replace(new RegExp('=', 'g'), 'equals');
        var msg = new SpeechSynthesisUtterance(input);
        msg.volume = Globals.voice.volume;
        msg.rate = Globals.voice.rate;
        msg.pitch = Globals.voice.pitch;
        msg.lang = Globals.voice.lang;
        msg.onend = function(){
            Globals.speech_lock = true;
            try{
                console.log(options);
                window.speechSynthesis.speak(options);
            }catch(e){
                // No chained speech
            }
        }
        window.speechSynthesis.speak(msg);
    },

    readEq: function(input, options) {
        Speech.read(input, options);
    },

    increaseRate: function() {
        Globals.voice.rate = Math.min(Globals.voice.rate+0.2, 2.0);
    },

    decreaseRate: function() {
        Globals.voice.rate = Math.max(Globals.voice.rate-0.2, 0.4);
    }
}
