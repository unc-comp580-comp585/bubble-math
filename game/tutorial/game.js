var tutorial = function(game) {

};

tutorial.prototype = {
    sounds: {},

    // Hard-coded questions/answers for tutorial
    questions: ["2 + 2", "7 - 2", "4 + 5", "8 + 3"],
    answers: ["9", "4", "5", "11"],
    angles: [0, 90, 180, 270],

    score: 0,
    score_multiplier: 1,
    score_selectors: 0,

    bubbles: [],
    wand: {},
    text: {},
    score_text: {},
    score_multiplier_text: {},
    bg: {},

    bubbleSelection: 0,
    questionIndex: 0,
    incorrectCounter: 0,
    won: false,

    tutorial_objects: [],
    tutorial_states: [],
    tutorial_state_idx: -1,
    tutorial_running: true,

    preload: function() {
        this.loadGFXAssets();
        this.loadSFXAssets();
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
        }
        this.bindEssentialKeys();
        this.initializeTutorial();
    },

    update: function() {
        if (this.questionIndex < this.questions.length) {
            this.updateBubbleColors();
            this.updateGFX();
        }

        if (this.questionIndex == this.questions.length) {
            if (this.interval !== null) {
                // TODO: What is this?
                clearInterval(this.interval);
            }
        }

        if (Globals.ControlSel === 2) {
            this.bindControllerScheme(0);
        } else if(Globals.ControlSel === 3) {
            this.bindControllerScheme(1);
        }
    },

    initializeTutorial: function() {
        this.drawGFX();

        this.drawBubbles();

        this.tutorial_objects = [
            this.text.question,
            this.text.score,
            this.text.multiplier,
            this.bg,
        ];
        let bubble_objects_and_wand = [this.wand];
        for (const bubble of this.bubbles) {
            bubble_objects_and_wand.push(bubble.sprite);
            bubble_objects_and_wand.push(bubble.numText);
        }
        for (const bubble_obj of bubble_objects_and_wand) {
            this.tutorial_objects.push(bubble_obj);
        }

        let outer = this;

        let dim_alpha = 0.2;

        this.tutorial_states.push({
            objs: [this.text.question],
            text: "This is the current question",
            callback: function() {
                for (let obj of outer.tutorial_objects) {
                    obj.alpha = dim_alpha;
                    for (let myobj of this.objs) {
                        if (myobj === obj) {
                            obj.alpha = 1.0;
                        }
                    }
                }
                if (Globals.DictationEnabled) {
                    Speech.read(this.text);
                }
                console.log(this.text);
            }
        });
        this.tutorial_states.push({
            objs: bubble_objects_and_wand,
            text: "This is where you select the bubble that answers the current question",
            callback: function() {
                for (let obj of outer.tutorial_objects) {
                    obj.alpha = dim_alpha;
                    for (let myobj of this.objs) {
                        if (myobj === obj) {
                            obj.alpha = 1.0;
                        }
                    }
                }
                if (Globals.DictationEnabled) {
                    Speech.read(this.text);
                }
                console.log(this.text);
            }
        });
        this.tutorial_states.push({
            objs: [this.text.score, this.text.multiplier],
            text: "This is your current score and streak",
            callback: function() {
                for (let obj of outer.tutorial_objects) {
                    obj.alpha = dim_alpha;
                    for (let myobj of this.objs) {
                        if (myobj === obj) {
                            obj.alpha = 1.0;
                        }
                    }
                }
                if (Globals.DictationEnabled) {
                    Speech.read(this.text);
                }
                console.log(this.text);
            }
        });
        this.tutorial_states.push({
            objs: [],
            text: "Ok, let's play!",
            callback: function() {
                for (let obj of outer.tutorial_objects) {
                    obj.alpha = 1.0;
                }
                if (Globals.DictationEnabled) {
                    Speech.read(this.text);
                }
                outer.tutorial_running = false;
                console.log(this.text);
            }
        });

        // Start tutorial
        this.Enter();
    },

    loadGFXAssets: function() {
        this.game.load.image('bg', 'assets/images/background.png');
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
        let w = this.game.world.width;
        let h = this.game.world.height;
        this.bg = this.game.add.sprite(w/2, h/2, 'bg');
        this.bg.anchor.setTo(0.5, 0.5);
        this.bg.width = w;
        this.bg.height = h;

        this.text.score = this.game.add.text(this.game.world.width - 220, 50, "", {
            font: "bold 26px Comic Sans MS",
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
        });
        this.text.score.anchor.setTo(0.0, 1.0);
        this.text.score.setText("Score: " + this.score);

        this.text.multiplier = this.game.add.text(this.game.world.width - 220, 100, "", {
            font: "bold 26px Comic Sans MS",
            fill: '#ffffff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
        });
        this.text.multiplier.anchor.setTo(0.0, 1.0);
        this.text.multiplier.setText("x" + this.score_multiplier);

        this.text.question = this.game.add.text(this.game.world.centerX, 50, "", {
            font: "bold 36px Comic Sans MS",
            fill: "#ffffff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });
        this.text.question.anchor.setTo(0.5, 0.5);

        let bunny = new Bunny(this.game, 110, 460, 200, 200);

        this.wand = new Wand(this.game, this.game.world.centerX, this.game.world.centerY);
        this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

    },

    drawBubbles: function() {
        this.bubbles = [];

        const radii = [70, 100, 130];
        const radius = 15;

        for (let i = 0; i < this.angles.length; i++) {
            let angle = this.angles[i] * Math.PI / 180.0;

            let cx = this.game.world.centerX + radii[0] * Math.sin(angle);
            let cy = this.game.world.centerY - radii[0] * Math.cos(angle);

            let num = this.answers[i];

            this.bubbles.push(new Bubble(this.game, cx, cy, radius, num));
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
            this.bubbles[this.bubbleSelection].numText.fill = '#000000';
        } else {
            this.bubbles[this.bubbleSelection].numText.fill = '#ffff00';
        }
    },

    updateGFX: function() {
        this.text.score.setText("Score: " + this.score);
        this.text.multiplier.setText("x" + this.score_multiplier);
        this.text.question.setText(this.questions[this.questionIndex]);
    },

    bindKeys: function() {
        let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(this.rotateCCW, this);

        let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(this.rotateCW, this);

        let Spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Spacebar.onDown.add(this.Select, this);

        let En = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        En.onDown.add(this.Enter, this);

        if (Globals.DictationEnabled) {
            let R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            R.onDown.add(function() {
                    Speech.readEq("The question is: " + this.questions[this.questionIndex] + ".");
            }, this)
        }
    },

    bindDictationKeys: function() {
        let A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(Speech.decreaseRate);

        let D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(Speech.increaseRate);
    },

    bindEssentialKeys: function() {
        let ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        ESC.onDown.add(function() {
            this.game.state.start("bootMainMenu");
        }, this);   
    },

    rotateCW: function() {
        if (!this.tutorial_running) {
            this.score_selectors++;

            if (Globals.SoundEnabled) {
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();
            }

            do {
                this.bubbleSelection = (this.bubbleSelection + 1) % this.questions.length;
            } while (this.bubbles[this.bubbleSelection].popped);

            if (Globals.DictationEnabled) {
                Speech.read(this.answers[this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[this.bubbleSelection]);
        }
    },

    rotateCCW: function() {
        if (!this.tutorial_running) {
            this.score_selectors++;

            if (Globals.SoundEnabled) {
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();
            }

            do {
                if (this.bubbleSelection - 1 < 0) {
                    this.bubbleSelection = this.questions.length - 1;
                } else {
                    this.bubbleSelection = this.bubbleSelection - 1;
                }
            } while (this.bubbles[this.bubbleSelection].popped);

            if (Globals.DictationEnabled) {
                Speech.read(this.answers[this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[this.bubbleSelection]);
        }
    },

    Select: function() {
        if (!this.tutorial_running) {
            if (this.won) {
                this.initializeTutorial();
                this.wand.rotateTo(0);
                return;
            }

            let result = eval(this.questions[this.questionIndex]);
            let given = eval(this.answers[this.bubbleSelection]);
            if (given === result) {
                this.score += ((100) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
                this.score_multiplier += 1;
                this.score_selectors = 0;

                this.bubbles[this.bubbleSelection].sprite.animations.play('bubble-pop');
                this.bubbles[this.bubbleSelection].popped = true;
                this.bubbles[this.bubbleSelection].numText.visible = false;

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
        }
    },

    Enter: function() {
        this.tutorial_state_idx += 1;
        if (this.tutorial_state_idx == this.tutorial_states.length) {
            this.tutorial_running = false;
        }
        if (this.tutorial_running) {
            this.tutorial_states[this.tutorial_state_idx].callback();
        }
    }
};
