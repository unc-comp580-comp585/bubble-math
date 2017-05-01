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

    gamepad: null,

    ApplyText: null,

    preload: function() {
        this.game.load.image('bg', 'assets/images/background.png');
    },

    initMenu: function() {
        // Background
        let w = this.game.world.width;
        let h = this.game.world.height;
        let bg = this.game.add.sprite(w/2, h/2, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.width = w;
        bg.height = h;
        bg.alpha = 0.7;

        font = {
            font: "30px Comic Sans MS",
            fill: "#ffffff",
        };

        // Number of Bubbles
        this.NumberBubblesText = this.game.add.text(300, 100, 'Number of Bubbles', font);
        this.NumberBubbles4 = this.game.add.text(600, 100, '4', font);
        this.NumberBubbles8 = this.game.add.text(650, 100, '8', font);
        this.NumberBubbles12 = this.game.add.text(700, 100, '12', font);

        // Grade
        this.GradeText = this.game.add.text(300, 150, 'Grade', font);
        this.Grade1 = this.game.add.text(600, 150, '1', font);
        this.Grade2 = this.game.add.text(650, 150, '2', font);
        this.Grade3 = this.game.add.text(700, 150, '3', font);
        this.Grade4 = this.game.add.text(750, 150, '4', font);

        // Dictation Options
        this.DictationText = this.game.add.text(300, 200, 'Dictation', font);
        this.DictationOn = this.game.add.text(600, 200, 'On', font);
        this.DictationOff = this.game.add.text(700, 200, 'Off', font);

        // SFX Options
        this.SFXText = this.game.add.text(300, 250, 'Sound Effects', font);
        this.SFXOn = this.game.add.text(600, 250, 'On', font);
        this.SFXOff = this.game.add.text(700, 250, 'Off', font);

        // Music Options
        this.MusicText = this.game.add.text(300, 300, 'Music', font);
        this.MusicOn = this.game.add.text(600, 300, 'On', font);
        this.MusicOff = this.game.add.text(700, 300, 'Off', font);

        // Speech Recognition Options
        this.SpeechRecogText = this.game.add.text(300, 350, 'Speech Recognition', font);
        this.SpeechRecogOn = this.game.add.text(600, 350, 'On', font);
        this.SpeechRecogOff = this.game.add.text(700, 350, 'Off', font);

        // Control Scheme
        this.ControlText = this.game.add.text(300, 400, 'Control Mode', font);
        this.ControlKeyboard = this.game.add.text(150, 450, 'Keyboard', font);
        this.ControlSwitch = this.game.add.text(325, 450, 'Switch', font);
        this.ControlGamepad1 = this.game.add.text(450, 450, 'Controller (1)', font);
        this.ControlGamepad2 = this.game.add.text(675, 450, "Controller (2)", font);

        // Back
        this.ApplyText = this.game.add.text(100, 530, 'Back', font);
    },

    drawSelectedOptions: function() {
        if (Globals.MusicEnabled) {
            this.MusicOn.addColor('#ff0000', 0);
        } else {
            this.MusicOff.addColor('#ff0000', 0);
        }

        if (Globals.DictationEnabled) {
            this.DictationOn.addColor('#ff0000', 0);
        } else {
            this.DictationOff.addColor('#ff0000', 0);
        }

        if (Globals.SoundEnabled) {
            this.SFXOn.addColor('#ff0000', 0);
        } else {
            this.SFXOff.addColor('#ff0000', 0);
        }

        if (Globals.SpeechRecognitionEnabled) {
            this.SpeechRecogOn.addColor('#ff0000', 0);
        } else {
            this.SpeechRecogOff.addColor('#ff0000', 0);
        }

        switch (Globals.GradeSel) {
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

        switch (Globals.NumberBubbles) {
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

        switch (Globals.ControlSel) {
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

        clearTimeouts();
        window.speechSynthesis.cancel();

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

        let esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        esc.onDown.add(this.back, this);

        this.game.input.gamepad.start();
        this.gamepad = this.game.input.gamepad.pad1;
    },

    back: function(bypass) {
        if (this.optionSel == 7 || bypass) {
            this.game.state.start("startMainMenu");
        }
    },

    increaseSel: function() {
        if (this.optionSel + 1 > 7) {
            this.optionSel = 0;
        } else {
            this.optionSel ++;
        }
    },

    decreaseSel: function() {
        if (this.optionSel - 1 < 0) {
            this.optionSel = 7;
        } else {
            this.optionSel --;
        }
    },

    decreaseOptionSel: function() {
        switch (this.optionSel) {
            case 0:
                if (this.bubbleSel - 1 < 0) {
                    this.bubbleSel = 2;
                } else {
                    this.bubbleSel --;
                }
                Globals.NumberBubbles = this.bubbleSel;
                break;
            case 1:
                if (this.gradeSel - 1 < 0) {
                    this.gradeSel = 3;
                } else {
                    this.gradeSel --;
                }
                Globals.GradeSel = this.gradeSel;
                break;
            case 2:
                this.dictationSel = !this.dictationSel;
                Globals.DictationEnabled = this.dictationSel;
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
                if (this.controlSel - 1 < 0) {
                    this.controlSel = 3;
                } else {
                    this.controlSel --;
                }
                Globals.ControlSel = this.controlSel;
                break;
        }
    },

    increaseOptionSel: function() {
        switch (this.optionSel) {
            case 0:
                if (this.bubbleSel + 1 > 2) {
                    this.bubbleSel = 0;
                } else {

                }
                    this.bubbleSel ++;
                Globals.NumberBubbles = this.bubbleSel;
                break;
            case 1:
                if (this.gradeSel + 1 > 3) {
                    this.gradeSel = 0;
                } else {
                    this.gradeSel ++;
                }
                Globals.GradeSel = this.gradeSel;
                break;
            case 2:
                this.dictationSel = !this.dictationSel;
                Globals.DictationEnabled = this.dictationSel;
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
                if (this.controlSel + 1 > 3) {
                    this.controlSel = 0;
                } else {
                    this.controlSel ++;
                }
                Globals.ControlSel = this.controlSel;
                break;
        }
    },

    update: function() {
        this.resetColors();
        this.drawSelectedOptions();
        this.bindControllerScheme(0);
        switch (this.optionSel) {
            case 0:
                this.NumberBubblesText.addColor('#00ff00', 0);
                switch (this.bubbleSel) {
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
                switch (this.gradeSel) {
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
                if (this.dictationSel) {
                    this.DictationOn.addColor('#00ff00', 0);
                } else {
                    this.DictationOff.addColor('#00ff00', 0);
                }
                break;
            case 3:
                this.SFXText.addColor('#00ff00', 0);
                if (this.sfxSel) {
                    this.SFXOn.addColor('#00ff00', 0);
                } else {
                    this.SFXOff.addColor('#00ff00', 0);
                }
                break;
            case 4:
                this.MusicText.addColor('#00ff00', 0);
                if (this.musicSel) {
                    this.MusicOn.addColor('#00ff00', 0);
                } else {
                    this.MusicOff.addColor('#00ff00', 0);
                }
                break;
            case 5:
                this.SpeechRecogText.addColor('#00ff00', 0);
                if (this.speechRec) {
                    this.SpeechRecogOn.addColor('#00ff00', 0);
                } else {
                    this.SpeechRecogOff.addColor('#00ff00', 0);
                }
                break;
            case 6:
                this.ControlText.addColor('#00ff00', 0);
                switch (this.controlSel) {
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

    processAnalog: function(angle, scheme_id) { 
        if (angle >= 0 && angle < 180) {
            this.decreaseSel();
        } else {
            this.increaseSel();
        }
    },

    bindControllerScheme: function(scheme_id) {
        if (this.gamepad === null) {
            console.error("Gamepad was not setup correctly.");
            return;
        }
        this.processControllerButtons();
        let angle = this.getControllerAngle();
        this.cntrlCounter ++;
        this.cntrlCounter = this.cntrlCounter % this.cntrollerReset;
        if(angle != null && this.cntrlCounter == 0) {
            this.processAnalog(angle, 0);
        }
    },

    getControllerAngle: function() {
        let x = this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        let y = -this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        let isX = Math.abs(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) > Globals.jsDeadZone;
        let isY = Math.abs(this.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)) > Globals.jsDeadZone;
        if (isX || isY) {
            let tmp = Math.atan2(y, x);
            let angle = 0;
            if (y < 0) {
                tmp += 2 * Math.PI;
                angle = (360.0 * tmp) / (2 * Math.PI);
            } else {
                angle = (360.0 * tmp) / (2 * Math.PI);
            }
            angle = Math.abs(angle);
            return angle;
        }
        return null;
    },

    processControllerButtons: function() {
        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_A, 20)) {
                this.back(false);
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_B, 20)) {
                this.back(true);
        }
        
        if(this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER, 20)) {
            this.increaseOptionSel();
        }

        if(this.gamepad.justPressed(Phaser.Gamepad.XBOX360_LEFT_BUMPER, 20)) {
            this.decreaseOptionSel();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_START, 20)) {
            this.back(true);
        }

        if(this.gamepad.justPressed(Phaser.Gamepad.XBOX360_BACK, 20)) {
            this.back(true);
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_UP, 20)) {
            this.decreaseSel(); 
        }

        if(this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_LEFT, 20)) {
            this.decreaseOptionSel();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_RIGHT, 20)) {
            this.increaseOptionSel();
        }

        if(this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN, 20)) {
            this.increaseSel();
        }
    },    
    
    optionSel : 0,
    cntrlCounter: 0,
    cntrollerReset: 10,
    bubbleSel : 0,
    gradeSel : 0,
    dictationSel: true,
    sfxSel: true,
    musicSel: false,
    speechRec: true,
    controlSel: 0,

};
