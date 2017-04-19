var optionsMenu = function(game) {

};

optionsMenu.prototype = {

    NumberBubblesText: null,
    NumberBubbles4: null,
    NumberBubbles8: null,
    NumberBubbles12: null,
    
    GradeText: null,
    Grade1: null,
    Grade2: null,
    Grade3: null,
    Grade4: null,

    DictationText: null,
    DictationOn: null,
    DictationOff: null,

    SFXText: null,
    SFXOn: null,
    SFXOff: null,

    MusicText: null,
    MusicOn: null,
    MusicOff: null,

    SpeechRecogText: null,
    SpeechRecogOn: null,
    SpeechRecogOff: null,

    ControlText: null,
    ControlKeyboard: null,
    ControlSwitch: null,
    ControlGamepad1: null,
    ControlGamepad2: null,

    ApplyText: null,

    preload: function() {
    },

    initMenu: function() {
        
        //Number of Bubbles
        this.NumberBubblesText = this.game.add.text(100, 100, 'Number of Bubbles', {font : '30px Arial', fill: '#ffffff'});
        this.NumberBubbles4 = this.game.add.text(400, 100, '4', {font : '30px Arial', fill: '#ffffff'});
        this.NumberBubbles8 = this.game.add.text(450, 100, '8', {font : '30px Arial', fill: '#ffffff'});
        this.NumberBubbles12 = this.game.add.text(500, 100, '12', {font : '30px Arial', fill: '#ffffff'});
        
        //Grade
        this.GradeText = this.game.add.text(100, 150, 'Grade', {font : '30px Arial', fill: '#ffffff'});
        this.Grade1 = this.game.add.text(400, 150, '1', {font : '30px Arial', fill: '#ffffff'});
        this.Grade2 = this.game.add.text(450, 150, '2', {font : '30px Arial', fill: '#ffffff'});
        this.Grade3 = this.game.add.text(500, 150, '3', {font : '30px Arial', fill: '#ffffff'});
        this.Grade4 = this.game.add.text(550, 150, '4', {font : '30px Arial', fill: '#ffffff'});
        
        //Dictation Options
        this.DictationText = this.game.add.text(100, 200, 'Dictation', {font : '30px Arial', fill: '#ffffff'});
        this.DictationOn = this.game.add.text(400, 200, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.DictationOff = this.game.add.text(500, 200, 'Off', {font : '30px Arial', fill: '#ffffff'});
        
        //SFX Options
        this.SFXText = this.game.add.text(100, 250, 'Sound Effects', {font : '30px Arial', fill: '#ffffff'});
        this.SFXOn = this.game.add.text(400, 250, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.SFXOff = this.game.add.text(500, 250, 'Off', {font : '30px Arial', fill: '#ffffff'});
        
        //Music Options
        this.MusicText = this.game.add.text(100, 300, 'Music', {font : '30px Arial', fill: '#ffffff'});
        this.MusicOn = this.game.add.text(400, 300, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.MusicOff = this.game.add.text(500, 300, 'Off', {font : '30px Arial', fill: '#ffffff'});

        //Speech Recognition Options
        this.SpeechRecogText = this.game.add.text(100, 350, 'Speech Recognition', {font : '30px Arial', fill: '#ffffff'});
        this.SpeechRecogOn = this.game.add.text(400, 350, 'On', {font : '30px Arial', fill: '#ffffff'});
        this.SpeechRecogOff = this.game.add.text(500, 350, 'Off', {font : '30px Arial', fill: '#ffffff'});

        //Control Scheme
        this.ControlText = this.game.add.text(100, 400, 'Control Mode', {font : '30px Arial', fill: '#ffffff'});
        this.ControlKeyboard = this.game.add.text(150, 450, 'Keyboard', {font : '30px Arial', fill: '#ffffff'});
        this.ControlSwitch = this.game.add.text(325, 450, 'Switch', {font : '30px Arial', fill: '#ffffff'});
        this.ControlGamepad1 = this.game.add.text(450, 450, 'Controller (1)', {font : '30px Arial', fill: '#ffffff'});
        this.ControlGamepad2 = this.game.add.text(325, 500, "Controller (2)", {font: '30px Arial', fill: '#ffffff'})


        //back
        this.ApplyText = this.game.add.text(100, 550, 'Apply', {font : '30px Arial', fill: '#ffffff'});
    },

    drawSelectedOptions: function() {
        if(Globals.MusicEnabled) 
            this.MusicOn.addColor('#ff0000', 0);
        else 
            this.MusicOff.addColor('#ff0000', 0);

        if(Globals.DictationEnabled) 
            this.DictationOn.addColor('#ff0000', 0);
        else 
            this.DictationOff.addColor('#ff0000', 0);

        if(Globals.SoundEnabled) 
            this.SFXOn.addColor('#ff0000', 0);
        else 
            this.SFXOff.addColor('#ff0000', 0);

        if(Globals.SpeechRecognitionEnabled) 
            this.SpeechRecogOn.addColor('#ff0000', 0);
        else 
            this.SpeechRecogOff.addColor('#ff0000', 0);


        switch(Globals.GradeSel) {
            case 0:
                this.Grade1.addColor('#ff0000', 0);
                break;
            case 1:
                this.Grade2.addColor('#ff0000', 0);
                break;
            case 2:
                this.Grade3.addColor('#ff0000', 0);
                break;
            case 3:
                this.Grade4.addColor('#ff0000', 0);
                break;
        }

        switch(Globals.NumberBubbles) {
            case 0:
                this.NumberBubbles4.addColor('#ff0000', 0);
                break;
            case 1:
                this.NumberBubbles8.addColor('#ff0000', 0);
                break;
            case 2:
                this.NumberBubbles12.addColor('#ff0000', 0);
                break;
        }

        switch(Globals.ControlSel) {
            case 0:
                this.ControlKeyboard.addColor('#ff0000', 0);
                break;
            case 1:
                this.ControlSwitch.addColor('#ff0000', 0);
                break;
            case 2:
                this.ControlGamepad1.addColor('#ff0000', 0);
                break;
            case 3:
                this.ControlGamepad2.addColor('#ff0000', 0);
                break;
        }
    },

    resetColors: function() {
        this.NumberBubblesText.addColor('#ffffff', 0);
        this.NumberBubbles4.addColor('#ffffff', 0);
        this.NumberBubbles8.addColor('#ffffff', 0);
        this.NumberBubbles12.addColor('#ffffff', 0);
        
        this.GradeText.addColor('#ffffff', 0);
        this.Grade1.addColor('#ffffff', 0);
        this.Grade2.addColor('#ffffff', 0);
        this.Grade3.addColor('#ffffff', 0);
        this.Grade4.addColor('#ffffff', 0);

        this.DictationText.addColor('#ffffff', 0);
        this.DictationOn.addColor('#ffffff', 0);
        this.DictationOff.addColor('#ffffff', 0);

        this.SFXText.addColor('#ffffff', 0);
        this.SFXOn.addColor('#ffffff', 0);
        this.SFXOff.addColor('#ffffff', 0);

        this.MusicText.addColor('#ffffff', 0);
        this.MusicOn.addColor('#ffffff', 0);
        this.MusicOff.addColor('#ffffff', 0);

        this.SpeechRecogText.addColor('#ffffff', 0);
        this.SpeechRecogOn.addColor('#ffffff', 0);
        this.SpeechRecogOff.addColor('#ffffff', 0);

        this.ControlText.addColor('#ffffff', 0);
        this.ControlKeyboard.addColor('#ffffff', 0);
        this.ControlSwitch.addColor('#ffffff', 0);
        this.ControlGamepad1.addColor('#ffffff', 0);
        this.ControlGamepad2.addColor('#ffffff', 0);

        this.ApplyText.addColor('#ffffff', 0);
    },

    create: function() {
        this.initMenu();

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
                    this.controlSel = 3;
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
                if(this.controlSel + 1 > 3)
                    this.controlSel = 0;
                else
                    this.controlSel ++;
                Globals.ControlSel = this.controlSel;
                break;
        }
    },


    update: function() {
        this.resetColors();
        this.drawSelectedOptions();
        switch(this.optionSel) {
            case 0: 
                this.NumberBubblesText.addColor('#00ff00', 0);
                switch(this.bubbleSel) {
                    case 0:
                        this.NumberBubbles4.addColor('#00ff00', 0);
                        break;
                    case 1:
                        this.NumberBubbles8.addColor('#00ff00', 0);
                        break;
                    case 2:
                        this.NumberBubbles12.addColor('#00ff00', 0);
                        break;
                }
                break;
            case 1:
                this.GradeText.addColor('#00ff00', 0);
                switch(this.gradeSel) {
                    case 0:
                        this.Grade1.addColor('#00ff00', 0);
                        break;
                    case 1:
                        this.Grade2.addColor('#00ff00', 0);
                        break;
                    case 2:
                        this.Grade3.addColor('#00ff00', 0);
                        break;
                    case 3:
                        this.Grade4.addColor('#00ff00', 0);
                        break;
                }
                break;
            case 2:
                this.DictationText.addColor('#00ff00', 0);;
                if(this.dictationSel)
                    this.DictationOn.addColor('#00ff00', 0);
                else
                    this.DictationOff.addColor('#00ff00', 0);
                break;
            case 3:
                this.SFXText.addColor('#00ff00', 0);
                if(this.sfxSel)
                    this.SFXOn.addColor('#00ff00', 0);
                else 
                    this.SFXOff.addColor('#00ff00', 0);
                break;
            case 4:
                this.MusicText.addColor('#00ff00', 0);
                if(this.musicSel) 
                    this.MusicOn.addColor('#00ff00', 0);
                else
                    this.MusicOff.addColor('#00ff00', 0);
                break;
            case 5:
                this.SpeechRecogText.addColor('#00ff00', 0);
                if(this.speechRec)
                    this.SpeechRecogOn.addColor('#00ff00', 0);
                else
                    this.SpeechRecogOff.addColor('#00ff00', 0);
                break;
            case 6:
                this.ControlText.addColor('#00ff00', 0);
                switch(this.controlSel) {
                    case 0:
                        this.ControlKeyboard.addColor('#00ff00', 0);
                        break;
                    case 1:
                        this.ControlSwitch.addColor('#00ff00', 0);
                        break;
                    case 2:
                        this.ControlGamepad1.addColor('#00ff00', 0);
                        break;
                    case 3:
                        this.ControlGamepad2.addColor('#00ff00', 0);
                        break;
                }
                break;
            case 7:
                this.ApplyText.addColor('#00ff00', 0);
                break;
        }
    },

    optionSel : 0,
    bubbleSel : 0,
    gradeSel : 0,
    dictationSel: true,
    sfxSel: true,
    musicSel: false,
    speechRec: true,
    controlSel: 0,

};
