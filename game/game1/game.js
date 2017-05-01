var gamemode1 = function(game) {

};

gamemode1.prototype = {
    score : 0,
    score_multiplier: 0,
    score_selectors: 0,

    operations: [],
    fractions: false,
    questions: [],
    answers: [],

    sounds: {},
    notes: ["c", "d", "e", "f", "g", "a", "b", "c", "d", "e", "f", "g"],
    octaves: [4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5],

    // Graphics
    bubbles: [],
    text : {},
    wand: null,
    progressBar: null,

    bubbleSelection: 0,
    questionIndex: 0,
    incorrectCounter: 0,
    won: false,

    gamepad: null,

    speechRecog : {},

    angles: [
        [0, 90, 180, 270],
        [0, 45, 90, 135, 180, 225, 270, 315],
        [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    ],

    wheel: [
        [1, 0, 3, 2],
        [2, 1, 0, 7, 6, 5, 4, 3],
        [3,2, 1, 0, 11, 10, 9, 8, 7, 6 ,5, 4],
    ],

    interval: null,

    preload: function() {
        // Score stuff
        this.score = 0;
        this.score_multiplier = 1;
        this.score_selectors = 0;

        this.loadGFXAssets();
        this.loadSFXAssets();
    },

    loadGFXAssets: function() {
        // Load background
        this.game.load.image('bg', 'assets/images/background.png').volume;

        // Bunny
        this.game.load.image('usagi', 'assets/images/bunny.png');

        // Bubble
        this.game.load.image('bubble', 'assets/images/bubble.png');

        // Wand
        this.game.load.image('wand', 'assets/images/wand.png');

        // Bubble popping
        this.game.load.spritesheet('bubble-pop', 'assets/sheets/bubble-popping.png', 256, 256);

        // Bunny jumping
        this.game.load.spritesheet('usagi-jump', 'assets/sheets/bunny-jump.png', 256, 256);
    },

    loadSFXAssets: function() {
        if (Globals.MusicEnabled) {
            // Music
            this.game.load.audio('bgm', 'assets/audio/8bit_bg.wav');
        }

        if (Globals.SoundEnabled) {
            // Pop sounds
            this.game.load.audio('pop_1', 'assets/audio/bubble-pop-1.mp3');
            this.game.load.audio('pop_2', 'assets/audio/bubble-pop-2.mp3');
            this.game.load.audio('pop_3', 'assets/audio/bubble-pop-3.mp3');

            // Incorrect noise
            this.game.load.audio('wrong', 'assets/audio/wrong-1.mp3');

            // You won hooooraaaay
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
            // Popping Sounds
            this.sounds['pops'] = [];
            this.sounds['pops'].push(this.game.add.audio('pop_1'));
            this.sounds['pops'].push(this.game.add.audio('pop_2'));
            this.sounds['pops'].push(this.game.add.audio('pop_3'));

            // Wrong Sound
            this.sounds['wrong'] = this.game.add.audio('wrong');

            // Win Sound
            this.sounds['win'] = this.game.add.audio('win');

            tones.attack = 0;
            tones.release = 200;
            tones.type = "triangle";
            // tones.volume = 0.4;

            this.sounds['win'].volume = 0.3;
            this.sounds['wrong'].volume = 0.3;
        }
    },

    create: function() {
        this.addSFXAssets();

        if (Globals.MusicEnabled) {
            this.sounds['bgm'].play();
        }

        if (Globals.ControlSel === 0) {
            this.bindKeys();
            if (Globals.DictationEnabled) {
                this.bindDictationKeys();
            }
        } else if (Globals.ControlSel >= 2) {
            this.game.input.gamepad.start();
            this.gamepad = this.game.input.gamepad.pad1;
        }

        if (Globals.SpeechRecognitionEnabled) {
            this.speechRecog = SpRecog.init(this.speechRecog);
            this.bindSpeechKeys();
        }

        this.bindEssentialKeys();

        this.initializeNewGame();
    },

    initializeNewGame: function() {
        this.drawGFX();

        this.operations = Globals.GradeSel >= 2 ? ['+', '-', '*', '/'] : ['+', '-'];
        this.fractions = Globals.GradeSel % 2 == 1;

        this.questionIndex = 0;

        this.bubbleSelection = 0;

        this.won = false;

        this.genEquations();

        this.drawBubbles();

        this.updateGFX();

        if (Globals.DictationEnabled) {
            Speech.readEq(this.questions[this.questionIndex]);
        }

        if (Globals.ControlSel === 1) {
            this.bindSwitch();
        }
    },

    bindSpeechKeys: function() {
        let T = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
        T.onDown.add(this.onSpeechRecog, this);
    },

    onSpeechRecog: function() {
        this.speechRecog.onresult = (event) => {
            let last = event.results.length - 1;
            let number = event.results[last][0].transcript;
            console.dir("Recieved: " + number);
            if (Number.isInteger(parseInt(number))) {
                this.selectAnswer(parseInt(number));
            } else {
                this.selectAnswer(parseInt(Globals.numbers[number]));
            }
        }

        this.speechRecog.onspeechend = (event) => {
            console.log("ended recog");
            this.speechRecog.stop();
        }

        this.speechRecog.onnomatch = (event) => {
            console.warn("what?");
        }

        this.speechRecog.onerror = (event) => {
            console.error("error occured in recognition " + event.error );
        }

        SpRecog.listen(this.speechRecog);
    },

    selectAnswer: function(answer) {
        if (this.won) {
            this.initializeNewGame();
            this.wand.rotateTo(0);
            return;
        }

        let result = eval(this.questions[this.questionIndex]);
        let given = answer;

        if (given === result) {
            // Score stuff
            this.score += ((100) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
            this.score_multiplier += 1;
            this.score_selectors = 0;

            // Animation stuff
            this.bubbles[this.bubbleSelection].sprite.animations.play('bubble-pop');
            this.bubbles[this.bubbleSelection].popped = true;
            this.bubbles[this.bubbleSelection].numText.visible = false;

            // Mechanics stuff
            this.questionIndex ++;
            this.incorrectCounter = 0;

            if (Globals.SoundEnabled) {
                this.sounds['pops'][this.game.rnd.integerInRange(0, this.sounds.pops.length - 1)].play();
            }

            if (this.questionIndex === this.questions.length) {
                if (Globals.SoundEnabled) {
                    this.sounds['win'].play();
                }
                this.won = true;
                return;
            }

            if (Globals.DictationEnabled) {
                Speech.readEq(this.questions[this.questionIndex]);
            }
        } else {
            if (Globals.SoundEnabled) {
                this.sounds['wrong'].play();
            }

            this.score_multiplier = 1;
            this.incorrectCounter++;
        }
    },

    updateGFX: function() {
        this.text.score.setText("Score: " + this.score);
        this.text.multiplier.setText("x" + this.score_multiplier);

        let text = this.questions[this.questionIndex];

        let fractions_enabled = (Globals.GradeSel % 2 == 1);
        if (fractions_enabled) {
            let len = text.length;
            let op_idx = text.search(/\s(\+|-|\*|\/)\s/);
            let op = text.substring(op_idx+1, op_idx+2);
            let fst_expr = text.substring(1, op_idx-1);
            let snd_expr = text.substring(op_idx+4, len-1);

            let fst_slash_idx = fst_expr.indexOf("/");
            let snd_slash_idx = snd_expr.indexOf("/");

            let fst_numer = fst_expr.substring(0, fst_slash_idx);
            let fst_denom = fst_expr.substring(fst_slash_idx+1);
            let snd_numer = snd_expr.substring(0, snd_slash_idx);
            let snd_denom = snd_expr.substring(snd_slash_idx+1);

            let fst_numer_double_digit = (fst_numer.length === 2);
            let fst_denom_double_digit = (fst_denom.length === 2);

            let top_space = "      ";
            let bot_space = "      ";

            if (fst_numer_double_digit) {
                top_space = "     ";
            }
            if (fst_denom_double_digit) {
                bot_space = "     ";
            }

            let top_line = fst_numer + top_space + snd_numer;
            let mid_line = "—  " + op + "  —";
            let bot_line = fst_denom + bot_space + snd_denom;

            text = top_line + "\n" + mid_line + "\n" + bot_line;

            text = text.replace("*", "×").replace("/", "÷");

            this.text.question.setText(text);
            this.text.question.lineSpacing = -30;
        } else {
            text = text.replace("*", "×").replace("/", "÷");
            this.text.question.setText(text);
        }
    },

    drawGFX: function() {
        let bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.width = this.game.world.width;
        bg.height = this.game.world.height;

        this.text.score = this.game.add.text(this.game.world.width - 220, 50, "", {
            font: "bold 26px Comic Sans MS",
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            stroke: 'black',
            strokeThickness: 4,
        });
        this.text.score.anchor.setTo(0.0, 1.0);
        this.text.score.setText("Score: " + this.score);

        this.text.multiplier = this.game.add.text(this.game.world.width - 220, 100, "", {
            font: "bold 26px Comic Sans MS",
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            stroke: 'black',
            strokeThickness: 4,
        });
        this.text.multiplier.anchor.setTo(0.0, 1.0);
        this.text.multiplier.setText("x" + this.score_multiplier);

        this.text.question = this.game.add.text(this.game.world.centerX, 50, "", {
            font: "bold 36px Comic Sans MS",
            fill: "#ffffff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: 'black',
            strokeThickness: 4,
        });
        this.text.question.anchor.setTo(0.5, 0.5);

        let bunny = new Bunny(this.game, 110, 510, 200, 200);

        this.wand = new Wand(this.game, this.game.world.centerX, this.game.world.centerY, false);
        this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

        // Progress text
        this.text.progress = this.game.add.text(this.game.world.width - 220, 150, "", {
            font: "bold 26px Comic Sans MS",
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            stroke: 'black',
            strokeThickness: 4,
        });
        this.text.progress.anchor.setTo(0.0, 1.0);
        this.text.progress.setText("Progress: " + String(this.questionIndex) + "/" + String(this.questions.length));

        // Progress bar
        this.progressBar = game.add.graphics(675,-325);
        this.progressBar.lineStyle(2, '0x000000');
        this.progressBar.beginFill('0xeeeeee',1);
        this.progressBar.drawRoundedRect(100,500,200,35,20);
        this.progressBar.endFill();
    },

    drawBubbles: function() {
        this.bubbles = [];
        const radii = [70, 100, 130];
        const radius = 15;

        for (let i = 0; i < this.angles[Globals.NumberBubbles].length; i++) {
            let angle = this.angles[Globals.NumberBubbles][i] * Math.PI / 180.0;
            let cx = this.game.world.centerX + radii[Globals.NumberBubbles] * Math.sin(angle);
            let cy = this.game.world.centerY - radii[Globals.NumberBubbles] * Math.cos(angle);

            let num = this.answers[i];

            this.bubbles.push(new Bubble(this.game, cx, cy, radius, num));
        }
    },

    genEquations: function() {
        let builtEq = [];
        let builtAns = [];
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let length = (1 + Globals.NumberBubbles) * 4;
        let j =0;
        while (j < length) {
            let eq = '';

            let opIndex = this.game.rnd.integerInRange(0, this.operations.length - 1);
            let op = this.operations[opIndex];

            let num1 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];
            let num2 = nums[this.game.rnd.integerInRange(0, (op === '-' ? num1 : nums.length)) - 1];
            let den1 = 1;
            let den2 = 1;
            let fractionalAns = false;
            if (this.fractions) {
                den1 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];
                den2 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];

                eq = '(' + num1 +  '/' + den1 + ') ' + op + ' (' + num2 + '/' + den2 + ')';
                fractionalAns = (num2 / den2) > (num1 / den1) && op === '/';
            } else {
                eq = '' + num1 + ' ' + op + ' ' + num2;
            }

            let result = (num1 / den1);

            if (op === '+') {
                result += (num2 / den2);
            } else if (op === '-') {
                result -= (num2 / den2);
            } else if (op === '*') {
                result *= (num2 / den2);
            } else if (op === '/') {
                result /= (num2 / den2);
            }

            let divByZero = num2 === 0 && op === '/';
            let notInt = !Number.isInteger(result);
            let alreadyGenerated = builtEq.indexOf(eq) !== -1;

            let count = 0;
            for (let ans of builtAns) {
                if (ans === result) {
                    count++;
                }
            }

            let tooMany = count > 2;

            if (divByZero || fractionalAns || notInt || alreadyGenerated || tooMany) {
                continue;
            } else {
                j++
                builtAns.push(''+result);
                builtEq.push(eq);
            }
        }
        this.shuffle(builtAns);
        this.questions = builtEq;
        this.answers = builtAns;
    },

    shuffle: function(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    },

    bindEssentialKeys: function() {
        let ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        ESC.onDown.add(function() {
            if (Globals.MusicEnabled) {
                this.sounds['bgm'].stop();
            }
            this.game.state.start("bootMainMenu");
        }, this);
    },

    bindKeys: function() {
        let A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(this.rotateCCW, this);

        let D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(this.rotateCW, this);

        let SPACE = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        SPACE.onDown.add(this.Select, this);

        if (Globals.DictationEnabled) {
            let R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            R.onDown.add(function() {
                Speech.readEq("The question is: " + this.questions[this.questionIndex] + ". Your score is: " + this.score);
            }, this);

            let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
            Q.onDown.add(function() {
                Globals.voice.rate += 0.1;
            }, this);

            let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
            E.onDown.add(function() {
                Globals.voice.rate -= 0.1;
            });

            let F = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
            F.onDown.add(this.readBubbles, this);
        }
    },

    rotateCW: function() {
        if (!this.won) {
            this.score_selectors++;

            do {
                this.bubbleSelection = (this.bubbleSelection + 1) % this.questions.length;
            } while (this.bubbles[this.bubbleSelection].popped)

            if (Globals.DictationEnabled) {
                Speech.read(this.answers[this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

            for (let bubble of this.bubbles) {
                bubble.selected = false;
                if (bubble === this.bubbles[this.bubbleSelection]) {
                    bubble.selected = true;
                }
                bubble.shrink();
                if (bubble.selected) {
                    bubble.enlarge();
                }
            }

            if (Globals.SoundEnabled) {
                tones.play(this.notes[this.bubbleSelection], this.octaves[this.bubbleSelection]);
            }
        }
    },

    rotateCCW: function() {
        if (!this.won) {
            this.score_selectors++;

            do {
                if (this.bubbleSelection - 1 < 0) {
                    this.bubbleSelection = this.questions.length - 1;
                } else {
                    this.bubbleSelection = this.bubbleSelection - 1;
                }
            } while (this.bubbles[this.bubbleSelection].popped)

            if (Globals.DictationEnabled) {
                Speech.read(this.answers[this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

            for (let bubble of this.bubbles) {
                bubble.selected = false;
                if (bubble === this.bubbles[this.bubbleSelection]) {
                    bubble.selected = true;
                }
                bubble.shrink();
                if (bubble.selected) {
                    bubble.enlarge();
                }
            }

            if (Globals.SoundEnabled) {
                tones.play(this.notes[this.bubbleSelection], this.octaves[this.bubbleSelection]);
            }
        }
    },

    Select: function() {
        if (this.won) {
            this.initializeNewGame();
            this.wand.rotateTo(0);
            return;
        }

        let result = eval(this.questions[this.questionIndex]);
        let given = eval(this.answers[this.bubbleSelection]);
        if (given === result) {
            // Score stuff
            this.score += ((100) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
            this.score_multiplier += 1;
            this.score_selectors = 0;

            // Animation stuff
            this.bubbles[this.bubbleSelection].sprite.animations.play('bubble-pop');
            this.bubbles[this.bubbleSelection].popped = true;
            this.bubbles[this.bubbleSelection].numText.visible = false;

            // Mechanics stuff
            this.questionIndex++;
            this.incorrectCounter = 0;

            this.updateProgressBar();

            if (Globals.SoundEnabled) {
                this.sounds['pops'][this.game.rnd.integerInRange(0, this.sounds.pops.length - 1)].play();
            }

            if (this.questionIndex === this.questions.length) {
                if (Globals.SoundEnabled) {
                    this.sounds['win'].play();
                }
                this.won = true;
                return;
            }

            if (Globals.DictationEnabled) {
                Speech.readEq(this.questions[this.questionIndex]);
            }
        } else {
            if (Globals.SoundEnabled) {
                this.sounds['wrong'].play();
            }
            if (Globals.DictationEnabled) {
                if (this.incorrectCounter < 2) {
                    if (given < result) {
                        Speech.read("Too small, try again");
                    } else {
                        Speech.read("Too large, try again");
                    }
                } else {
                    Speech.readEq(String(this.questions[this.questionIndex]) + " equals " + String(result));
                }
            }
            this.score_multiplier = 1;
            this.incorrectCounter++;
        }
    },

    bindSwitch: function() {
        this.interval = setInterval(() => this.rotateCW(), 1000);

        let S = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        S.onDown.add(this.Select, this);
    },

    bindDictationKeys: function() {
        let A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(Speech.decreaseRate);

        let D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(Speech.increaseRate);
    },

    processAnalog: function(angle, scheme_id) {
        if (scheme_id === 0) {
            if (angle <= 90 && angle > 270) {
                this.rotateCW();
            } else {
                this.rotateCW();
            }
        } else if (scheme_id === 1) {
            let _angles = this.angles[Globals.NumberBubbles];
            let index_selection = 0;
            for (let i = 0; i < _angles.length; i++) {
                if (angle <= _angles[i]) {
                    index_selection = i;
                    break;
                }
            }
            let newBubble = this.wheel[Globals.NumberBubbles][index_selection];
            if (this.bubbleSelection !== newBubble) {
                this.bubbleSelection = newBubble;
                this.wand.rotateTo(this.angles[Globals.NumberBubbles][newBubble]);
                if (Globals.DictationEnabled) {
                    Speech.readEq(this.answers[this.bubbleSelection]);
                }
                if (Globals.SoundEnabled) {
                    tones.play(this.notes[this.bubbleSelection], this.octaves[this.bubbleSelection]);
                }
            }
        } else {
            console.error("Invalid Control Scheme");
        }
    },

    bindControllerScheme: function(scheme_id) {
        if (this.gamepad === null) {
            console.error("Gamepad was not setup correctly.");
            return;
        }
        this.processControllerButtons();
        let angle = this.getControllerAngle();
        if (scheme_id === 0) {
            if (angle !== null) {
                this.processAnalog(angle, scheme_id);
            }
        } else if (scheme_id === 1) {
            if (angle !== null) {
                this.processAnalog(angle, scheme_id);
            }
        } else {
            console.error("Invalid Control Scheme");
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
            console.info("A Button");
            this.Select();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_START, 20)) {
            console.info("START");
            if (Globals.DictationEnabled)
                Speech.readEq(this.questions[this.questionIndex]);
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_B, 20) && !this.won) {
            console.info("B Button");
            // if (Globals.MusicEnabled) {
            //     this.sounds['bgm'].stop();
            // }
            // this.game.state.start("bootMainMenu");
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_Y, 20) && !this.won) {
            console.info("Y Button");
            Speech.readEq("The question is: " + this.questions[this.questionIndex] + ". Your score is: " + this.score);
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_X, 20) && !this.won) {
            console.info("X Button");
            if (Globals.DictationEnabled) {
                this.readBubbles();
            }
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_RIGHT_BUMPER, 20) && !this.won) {
            console.info("RIGHT BUMPER");
            if (Globals.DictationEnabled) {
                Speech.increaseRate();
            }
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_LEFT_BUMPER, 20) && !this.won) {
            console.info("LEFT BUMPER");
            if (Globals.DictationEnabled) {
                Speech.decreaseRate();
            }
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_BACK, 20)) {
            console.info("SELECT");
            if(Globals.MusicEnabled)
                this.sounds['bgm'].stop();
            this.game.state.start("bootMainMenu");
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_LEFT, 20) && !this.won) {
            console.info("DPAD Left");
            this.rotateCCW();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_RIGHT, 20) && !this.won) {
            console.info("DPAD Right");
            this.rotateCW();
        }

        // Unused
        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_UP, 20) && !this.won) {
            console.info("DPAD Up");
        }

        // Unused
        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN, 20) && !this.won) {
            console.info("DPAD Down");
        }
    },

    update: function() {
        if (this.questionIndex < this.questions.length) {
            this.updateBubbleColors();
            this.updateGFX();
        }

        if (this.questionIndex == this.questions.length) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        }

        if (Globals.ControlSel === 2) {
            this.bindControllerScheme(0);
        } else if (Globals.ControlSel === 3) {
            this.bindControllerScheme(1);
        }
    },

    updateBubbleColors: function() {
        for (let i = 0; i < this.bubbles.length; i++) {
            if (this.bubbles[i].popped) {
                this.bubbles[i].numText.fill = '#000000';
            } else {
                this.bubbles[i].numText.fill = '#ffffff';
            }
        }

        if (this.bubbles[this.bubbleSelection].popped) {
            this.bubbles[this.bubbleSelection].numText.fill =  '#000000';
        } else {
            this.bubbles[this.bubbleSelection].numText.fill = '#ffff00';
        }
    },

    updateProgressBar: function() {
        if (!this.won) {
            this.text.progress.setText("Progress: " + String(this.questionIndex) + "/" + String(this.questions.length));
        } else {
            this.text.progress.setText("Progress: " + String(this.questions.length) + "/" + String(this.questions.length));
        }
        this.progressBar.clear();
        this.progressBar = game.add.graphics(675,-325);
        this.progressBar.lineStyle(2, '0x000000');
        this.progressBar.beginFill('0xeeeeee',1);
        this.progressBar.drawRoundedRect(100,500,200,35,20);
        this.progressBar.endFill();
        this.progressBar.beginFill('0x8CE9FF',1);
        this.progressBar.drawRoundedRect(101,501,198/this.questions.length*this.questionIndex,33,20);
        this.progressBar.endFill();
    },

    readBubbles: async function() {
        let delay = 900 * (1 + Math.round(Globals.voice.rate / 2.0));
        let ring_delay = 450 * (1 + Math.round(Globals.voice.rate / 2.0));
        let count = 0;
        let bubble_text = [];
        let tone_index = [];
        for (let i = 0; i < this.bubbles.length; i++) {
            if (!this.bubbles[i].popped) {
                count++;
                bubble_text.push(String(this.bubbles[i].numText.text));
                tone_index.push(i);
            }
        }
        Speech.read("The remaining: " + String(count) + ".. bubbles are: ");
        await this.sleep(delay);
        for (let i = 0; i < bubble_text.length; i++) {
            await this.sleep(ring_delay).then(() => {
                if (Globals.SoundEnabled) {
                    tones.play(this.notes[tone_index[i]], this.octaves[tone_index[i]]);
                }
                if (Globals.SoundEnabled) {
                    Speech.read(String(bubble_text[i]));
                }
            });
        }
    },

    sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    },
}
