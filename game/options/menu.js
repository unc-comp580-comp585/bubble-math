var optionsMenu = function(game) {

};

optionsMenu.prototype = {
        preload: function() {


    },

    drawMenu: function() {
        
        //Number of Bubbles
        this.game.add.text(100, 100, 'Number of Bubbles', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 100, '4', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(450, 100, '8', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 100, '12', {font : '30px Arial', fill: '#ffffff'});
        
        //Grade
        this.game.add.text(100, 150, 'Grade', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 150, '1', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(450, 150, '2', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 150, '3', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(550, 150, '4', {font : '30px Arial', fill: '#ffffff'});
        
        //Dictation Options
        this.game.add.text(100, 200, 'Dictation', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 200, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 200, 'Off', {font : '30px Arial', fill: '#ffffff'});
        
        //SFX Options
        this.game.add.text(100, 250, 'Sound Effects', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 250, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 250, 'Off', {font : '30px Arial', fill: '#ffffff'});
        
        //Music Options
        this.game.add.text(100, 300, 'Music', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 300, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 300, 'Off', {font : '30px Arial', fill: '#ffffff'});

        //Speech Recognition Options
        this.game.add.text(100, 350, 'Speech Recognition', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(400, 350, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(500, 350, 'Off', {font : '30px Arial', fill: '#ffffff'});

        //Control Scheme
        this.game.add.text(100, 400, 'Control Mode', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(150, 450, 'Keyboard', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(325, 450, 'Switch', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(450, 450, 'Controller', {font : '30px Arial', fill: '#ffffff'});


        //back
        this.game.add.text(100, 500, 'Back', {font : '30px Arial', fill: '#ffffff'});
    },

    drawSelectedOptions: function() {
        if(Globals.MusicEnabled) 
            this.game.add.text(400, 300, 'On', {font : '30px Arial', fill: '#ff0000'});
        else 
            this.game.add.text(500, 300, 'Off', {font : '30px Arial', fill: '#ff0000'});

        if(Globals.DictationEnabled) 
            this.game.add.text(400, 200, 'On', {font : '30px Arial', fill: '#ff0000'});
        else 
            this.game.add.text(500, 200, 'Off', {font : '30px Arial', fill: '#ff0000'});

        if(Globals.SoundEnabled) 
            this.game.add.text(400, 250, 'On', {font : '30px Arial', fill: '#ff0000'});
        else 
            this.game.add.text(500, 250, 'Off', {font : '30px Arial', fill: '#ff0000'});

        if(Globals.SpeechRecognitionEnabled) 
            this.game.add.text(400, 350, 'On', {font : '30px Arial', fill: '#ff0000'});
        else 
            this.game.add.text(500, 350, 'Off', {font : '30px Arial', fill: '#ff0000'});


        switch(Globals.GradeSel) {
            case 0:
                this.game.add.text(400, 150, '1', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 1:
                this.game.add.text(450, 150, '2', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 2:
                this.game.add.text(500, 150, '3', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 3:
                this.game.add.text(550, 150, '4', {font : '30px Arial', fill: '#ff0000'});
                break;
        }

        switch(Globals.NumberBubbles) {
            case 0:
                this.game.add.text(400, 100, '4', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 1:
                this.game.add.text(450, 100, '8', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 2:
                this.game.add.text(500, 100, '12', {font : '30px Arial', fill: '#ff0000'});
                break;
        }

        switch(Globals.ControlSel) {
            case 0:
                this.game.add.text(150, 450, 'Keyboard', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 1:
                this.game.add.text(325, 450, 'Switch', {font : '30px Arial', fill: '#ff0000'});
                break;
            case 2:
                this.game.add.text(450, 450, 'Controller', {font : '30px Arial', fill: '#ff0000'});
                break;
        }
    },

    create: function() {
        this.drawMenu();

        this.selection = 0;

        let up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        up.onDown.add(this.decreaseSel, this);

        let down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        down.onDown.add(this.increaseSel, this);

        let left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        left.onDown.add(this.decreaseOptionSel, this);

        let right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        right.onDown.add(this.increaseOptionSel, this);

        let enter = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.back, this);
    },

    back: function() {
        if(this.optionSel == 7)
            this.game.state.start("startMainMenu");
    },

    increaseSel: function() {
        if(this.optionSel + 1 > 7)
            this.optionSel = 0;
        else
            this.optionSel ++;
    },

    decreaseSel: function() {
        if(this.optionSel - 1 < 0)
            this.optionSel = 7;
        else
            this.optionSel --;
    },

    decreaseOptionSel: function() {
        switch(this.optionSel) {
            case 0:
                if(this.bubbleSel - 1 < 0)
                    this.bubbleSel = 2;
                else
                    this.bubbleSel --;
                Globals.NumberBubbles = this.bubbleSel;
                break;
            case 1:
                if(this.gradeSel - 1 < 0)
                    this.gradeSel = 3;
                else
                    this.gradeSel --;
                Globals.GradeSel = this.gradeSel;
                break;
            case 2:
                this.dictationSel = !this.dictationSel;
                Globals.DictationEnabled = this.DictationEnabled;
                break;
            case 3:
                this.sfxSel = !this.sfxSel;
                Globals.SoundEnabled = this.sfxSel;
                break;
            case 4:
                this.musicSel = !this.musicSel;
                Globals.MusicEnabled = this.musicSel;
                break;
            case 5:
                this.speechRec = !this.speechRec;
                Globals.SpeechRecognitionEnabled = this.speechRec;
                break;
            case 6:
                if(this.controlSel - 1 < 0)
                    this.controlSel = 2;
                else
                    this.controlSel --;
                Globals.ControlSel = this.controlSel;
                break;
        }
    },

    increaseOptionSel: function() {
        switch(this.optionSel) {
            case 0:
                if(this.bubbleSel + 1 > 2)
                    this.bubbleSel = 0;
                else
                    this.bubbleSel ++;
                Globals.NumberBubbles = this.bubbleSel;
                break;
            case 1:
                if(this.gradeSel + 1 > 3)
                    this.gradeSel = 0;
                else
                    this.gradeSel ++;
                Globals.GradeSel = this.gradeSel;
                break;
            case 2:
                this.dictationSel = !this.dictationSel;
                Globals.DictationEnabled = this.DictationEnabled;
                break;
            case 3:
                this.sfxSel = !this.sfxSel;
                Globals.SoundEnabled = this.sfxSel;
                break;
            case 4:
                this.musicSel = !this.musicSel;
                Globals.MusicEnabled = this.musicSel;
                break;
            case 5:
                this.speechRec = !this.speechRec;
                Globals.SpeechRecognitionEnabled = this.speechRec;
                break;
            case 6:
                if(this.controlSel + 1 > 2)
                    this.controlSel = 0;
                else
                    this.controlSel ++;
                Globals.ControlSel = this.controlSel;
                break;
        }
    },


    update: function() {
        this.drawMenu();
        this.drawSelectedOptions();
        switch(this.optionSel) {
            case 0: 
                this.game.add.text(100, 100, 'Number of Bubbles', {font : '30px Arial', fill: '#00ff00'});
                switch(this.bubbleSel) {
                    case 0:
                        this.game.add.text(400, 100, '4', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 1:
                        this.game.add.text(450, 100, '8', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 2:
                        this.game.add.text(500, 100, '12', {font : '30px Arial', fill: '#00ff00'});
                        break;
                }
                break;
            case 1:
                this.game.add.text(100, 150, 'Grade', {font : '30px Arial', fill: '#00ff00'});
                switch(this.gradeSel) {
                    case 0:
                        this.game.add.text(400, 150, '1', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 1:
                        this.game.add.text(450, 150, '2', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 2:
                        this.game.add.text(500, 150, '3', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 3:
                        this.game.add.text(550, 150, '4', {font : '30px Arial', fill: '#00ff00'});
                        break;
                }
                break;
            case 2:
                this.game.add.text(100, 200, 'Dictation', {font : '30px Arial', fill: '#00ff00'});
                if(this.dictationSel) {
                    this.game.add.text(400, 200, 'On', {font : '30px Arial', fill: '#00ff00'});
                } else {
                    this.game.add.text(500, 200, 'Off', {font : '30px Arial', fill: '#00ff00'});
                }
                break;
            case 3:
                this.game.add.text(100, 250, 'Sound Effects', {font : '30px Arial', fill: '#00ff00'});
                if(this.sfxSel) {
                    this.game.add.text(400, 250, 'On', {font : '30px Arial', fill: '#00ff00'});
                } else {
                    this.game.add.text(500, 250, 'Off', {font : '30px Arial', fill: '#00ff00'});
                }
                break;
            case 4:
                this.game.add.text(100, 300, 'Music', {font : '30px Arial', fill: '#00ff00'});
                if(this.musicSel) {
                    this.game.add.text(400, 300, 'On', {font : '30px Arial', fill: '#00ff00'});
                } else {
                    this.game.add.text(500, 300, 'Off', {font : '30px Arial', fill: '#00ff00'});
                }
                break;
            case 5:
                this.game.add.text(100, 350, 'Speech Recognition', {font : '30px Arial', fill: '#00ff00'});
                if(this.speechRec) {
                    this.game.add.text(400, 350, 'On', {font : '30px Arial', fill: '#00ff00'});
                } else {
                    this.game.add.text(500, 350, 'Off', {font : '30px Arial', fill: '#00ff00'});
                }
                break;
            case 6:
                this.game.add.text(100, 400, 'Control Mode', {font : '30px Arial', fill: '#00ff00'});
                switch(this.controlSel) {
                    case 0:
                        this.game.add.text(150, 450, 'Keyboard', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 1:
                        this.game.add.text(325, 450, 'Switch', {font : '30px Arial', fill: '#00ff00'});
                        break;
                    case 2:
                        this.game.add.text(450, 450, 'Controller', {font : '30px Arial', fill: '#00ff00'});
                        break;
                }
                break;
            case 7:
                this.game.add.text(100, 500, 'Back', {font : '30px Arial', fill: '#00ff00'});
                break;
        }
    },

    optionSel : 0,
    bubbleSel : 0,
    gradeSel : 0,
    dictationSel: true,
    sfxSel: true,
    musicSel: true,
    speechRec: true,
    controlSel: 0,

};
