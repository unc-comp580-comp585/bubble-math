var Speech = {
    read: function(input) {
        // Web speech api
        clearTimeouts();
        window.speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance(input);
        msg.volume = Globals.voice.volume;
        msg.rate = Globals.voice.rate;
        msg.pitch = Globals.voice.pitch;
        msg.lang = Globals.voice.lang;
        window.speechSynthesis.speak(msg);
    },

    readEq: function(input) {
        input = input.replace(new RegExp('-', 'g'), 'minus');
        input = input.replace(new RegExp('/', 'g'), 'divided by');
        input = input.replace(new RegExp('\\*', 'g'), 'times');
        input = input.replace(new RegExp('=', 'g'), 'equals');
        Speech.read(input);
    },

    increaseRate: function() {
        Globals.voice.rate = Math.min(Globals.voice.rate+0.2, 2.0);
    },

    decreaseRate: function() {
        Globals.voice.rate = Math.max(Globals.voice.rate-0.2, 0.4);
    }
}
