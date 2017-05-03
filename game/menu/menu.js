var mainMenu = function(game) {

};

mainMenu.prototype = {
    titleText: null,
    tutorialText: null,
    game1Text: null,
    game2Text: null,
    optionsText: null,
    gamepad: null,

    preload: function() {
        this.game.load.image('bg', 'assets/images/background.png');
    },

    drawMenu: function() {
        // Background
        let w = this.game.world.width;
        let h = this.game.world.height;
        let bg = this.game.add.sprite(w/2, h/2, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.width = w;
        bg.height = h;
        bg.alpha = 0.7;

        let cx = this.game.world.centerX;

        let font = {
            font: "30px Comic Sans MS",
            fill: "#ffffff",
        };

        this.titleText = this.game.add.text(cx, 80, 'Bubble Math!', font);
        this.tutorialText = this.game.add.text(cx, 300, 'Tutorial', font);
        this.game1Text = this.game.add.text(cx, 350, 'Arithmetic', font);
        this.game2Text = this.game.add.text(cx, 400, 'Algebra', font);
        this.optionsText = this.game.add.text(cx, 450, 'Options', font);

        this.titleText.anchor.setTo(0.5, 0.5);
        this.tutorialText.anchor.setTo(0.5, 0.5);
        this.game1Text.anchor.setTo(0.5, 0.5);
        this.game2Text.anchor.setTo(0.5, 0.5);
        this.optionsText.anchor.setTo(0.5, 0.5);
    },

    create: function() {

        clearTimeouts();
        window.speechSynthesis.cancel();

        this.drawMenu();

        this.selection = 0;

        let enter = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.nextState, this);

        let up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(this.decreaseSel, this);

        let down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(this.increaseSel, this);

        this.game.input.gamepad.start();
        this.gamepad = this.game.input.gamepad.pad1;


    },

    increaseSel: function() {
        if (this.selection + 1 > 3) {
            this.selection = 0;
        } else {
            this.selection ++;
        }
    },

    decreaseSel: function() {
        if (this.selection - 1 < 0) {
            this.selection = 3;
        } else {
            this.selection--;
        }
    },

    nextState: function() {
        switch (this.selection) {
            case 0:
                Globals.GameMode = 0;
                this.game.state.start("Tutorial");
                break;
            case 1:
                Globals.GameMode = 1;
                this.game.state.start("Game1");
                break;
            case 2:
                Globals.GameMode = 2;
                this.game.state.start("Game2");
                break;
            case 3:
                this.game.state.start("Options");
                break;
        }
    },

    resetMenu: function() {
            this.tutorialText.addColor("#ffffff", 0);
            this.game1Text.addColor("#ffffff", 0);
            this.game2Text.addColor("#ffffff", 0);
            this.optionsText.addColor("#ffffff", 0);
    },

    update: function() {
        this.resetMenu();
        switch (this.selection) {
            case 0: this.tutorialText.addColor("#00ff00", 0); break;
            case 1: this.game1Text.addColor("#00ff00", 0); break;
            case 2: this.game2Text.addColor("#00ff00", 0); break;
            case 3: this.optionsText.addColor("#00ff00", 0); break;
        }

        if(this.gamepad != null) {
            this.bindControllerScheme(0);
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
            this.nextState();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_START, 20)) {
            this.nextState();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_UP, 20)) {
            this.decreaseSel(); 
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN, 20)) {
            this.increaseSel();
        }
    },
    selection: 0,
    cntrlCounter: 0,
    cntrollerReset: 10,
};
