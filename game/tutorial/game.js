var tutorial = function(game) {

};

tutorial.prototype = {
    // Sound map
    sounds: {},

    // Tutorial objects (each one gets focus in turn during tutorial)
    tutorial_objects: {},

    preload: function() {

    },

    create: function() {
        this.addSFXAssets();

        if (Globals.MusicEnabled) {
            this.sounds['bgm'].play();
        }

        if (Globals.ControlSel === 0) {
            this.bindKeys();
            if (Globals.DictationEnabled) {
                this.bindSpeechKeys();
            }
        }

        this.initializeTutorial();
    },

    update: function() {

    },

    initializeTutorial: function() {
        this.drawGFX();
    },

    loadGFXAssets: function() {
        this.game.load.image('bg', 'assets/images/background.png').volume;
        this.game.load.image('usagi', 'assets/images/bunny.png');
        this.game.load.image('bubble', 'assets/images/bubble.png');
        this.game.load.image('wand', 'assets/images/wand.png');
        this.game.load.spritesheet('bubble-pop', 'assets/sheets/bubble-popping.png', 256, 256);
        this.game.load.spritesheet('usagi-jump', 'assets/sheets/bunny-jump.png', 256, 256);
    },

    loadSFXAssets: function() {
        if (Globals.MusicEnabled) {
            // Background music
            this.game.load.audio('bgm', 'assets/audio/8bit_bg.wav');
        }

        if (Globals.SoundEnabled) {
            // Bubble popping sounds
            this.game.load.audio('pop_1', 'assets/audio/bubble-pop-1.mp3');
            this.game.load.audio('pop_2', 'assets/audio/bubble-pop-2.mp3');
            this.game.load.audio('pop_3', 'assets/audio/bubble-pop-3.mp3');

            // Transition sounds
            this.game.load.audio('short_1', 'assets/audio/short-bubbles-1.mp3');
            this.game.load.audio('short_2', 'assets/audio/short-bubbles-2.mp3');
            this.game.load.audio('short_3', 'assets/audio/short-bubbles-3.mp3');
            this.game.load.audio('short_4', 'assets/audio/short-bubbles-4.mp3');

            // Wrong answer
            this.game.load.audio('wrong', 'assets/audio/wrong-1.mp3');

            // Victory
            this.game.load.audio('win', 'assets/audio/achievement.mp3');
        }
    },

    addSFXAssets: function() {
        if (Globals.MusicEnabled) {
            this.sounds['bgm'] = this.game.add.audio('bgm');
            this.sounds['bgm'].loop = true;
            this.sounds['bgm'].volume = 0.25;
        }

        if (Globals.SoundEnabled) {
            // Popping sounds
            this.sounds['pops'] = [];
            this.sounds['pops'].push(this.game.add.audio('pop_1'));
            this.sounds['pops'].push(this.game.add.audio('pop_2'));
            this.sounds['pops'].push(this.game.add.audio('pop_3'));

            // Transitions
            this.sounds['trans'] = [];
            this.sounds['trans'].push(this.game.add.audio('short_1'));
            this.sounds['trans'].push(this.game.add.audio('short_2'));
            this.sounds['trans'].push(this.game.add.audio('short_3'));
            this.sounds['trans'].push(this.game.add.audio('short_4'));

            // Incorrect
            this.sounds['wrong'] = this.game.add.audio('wrong');

            // Victory
            this.sounds['win'] = this.game.add.audio('win');

            // Volume
            for (let snd of this.sounds['trans']) {
                snd.volume = 0.4;
            }
            this.sounds['win'].volume = 0.3;
            this.sounds['wrong'].volume = 0.3;
        }
    },

    drawGFX: function() {

    },

    bindKeys: function() {
        let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(this.rotateCCW, this);

        let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(this.rotateCW, this);

        let S = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        S.onDown.add(this.Select, this);

        if (Globals.DictationEnabled) {
            let R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            R.onDown.add(function() {
                    Speech.readEq("The question is: " + this.questions[this.questionIndex] + ".");
            }, this)
        }
    },

    bindSpeechKeys: function() {

    },

    rotateCW: function() {

    },

    rotateCCW: function() {

    },

    Select: function() {

    },
};
