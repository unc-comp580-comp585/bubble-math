var gamemode2 = function(game) {

};

gamemode2.prototype = {
    sounds: {},
    notes: ["c", "d", "e", "f", "g", "a", "b", "c", "d", "e", "f", "g"],
    octaves: [
        [3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
        [5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6]
    ],

    // Graphics
    bubbles: [[], []],
    text : {},
    wand: null,

    // Mechanics
    bubbleSelection: 0,
    answerIndex: 0,
    incorrectCounter: 0,
    won: false,
    operations: [],
    fractions: false,
    answers: [],
    selectedBubbles: [],
    selectedIndicies: [],
    isInnerRing: true,
    question: null,

    killIterations: 0,

    // Score
    score : 0,
    score_multiplier: 0,
    score_selectors: 0,

    // Speech recog instance and answer
    speechRecog : {},
    spoken_input: null,

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
        // Score shit
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
            // Popping sounds
            this.sounds['pops'] = [];
            this.sounds['pops'].push(this.game.add.audio('pop_1'));
            this.sounds['pops'].push(this.game.add.audio('pop_2'));
            this.sounds['pops'].push(this.game.add.audio('pop_3'));

            // Wrong sound
            this.sounds['wrong'] = this.game.add.audio('wrong');

            // Win sound
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
                this.bindSpeechKeys();
            }
        } else if (Globals.ControlSel >= 1) {
                this.game.input.gamepad.start();
                this.gamepad = this.game.input.gamepad.pad1;
        }

        this.bindEssentialKeys();

        this.initializeNewGame();
    },

    initializeNewGame: function() {
        this.operations = Globals.GradeSel >= 2 ? ['+', '-', '*', '/'] : ['+', '-'];
        this.fractions = Globals.GradeSel % 2 == 1 || Globals.GradeSel === 4;

        this.answerIndex = 0;
        this.bubbleSelection = 0;
        this.won = false;

        this.genEquations();
        this.drawGFX();
        this.drawBubbles();
        this.selectQuestion();
        this.updateGFX();

        this.isInnerRing = true;
        this.selectedBubbles = [];
        this.selectedIndicies = [];

        if (Globals.DictationEnabled) {
            Speech.readEq(this.question);
        }

        if (Globals.ControlSel === 1) {
            this.bindSwitch();
        }

        this.wand.rotateTo(0);
    },

    onSpeechRecog: function() {
        this.speechRecog.onresult = (event) => {
            let last = event.results.length - 1;
            let answer = event.results[last][0].transcript;
            console.dir("Recieved: " + answer);
            this.spoken_input = SpRecog.parseEq(answer);
            if (this.spoken_input.indexOf(new RegExp("/\+|\-|=|\\|\\*/"))) {
                this.Select();
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

    updateGFX: function() {
        let clipped_score = this.score;
        let score_str = this.score.toString();
        if (score_str.length >= 8) {
            clipped_score = score_str.substring(0, 5) + "...";
        }
        this.text.score.setText("Score: " + clipped_score);
        this.text.multiplier.setText("x" + this.score_multiplier);
        this.text.question.setText(this.question.replace(/\*/g, "×").replace(/\//g, "÷"));
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
        this.text.progress.setText("Progress: " + String(this.answerIndex) + "/" + String(this.answers[0].length));

        // Progress bar
        this.progressBar = game.add.graphics(675,-325);
        this.progressBar.lineStyle(2, '0x000000');
        this.progressBar.beginFill('0xeeeeee',1);
        this.progressBar.drawRoundedRect(100,500,200,35,20);
        this.progressBar.endFill();
    },

    drawBubbles: function() {
        const radii = [
            [70, 100, 140],
            [150, 170, 210]
        ];

        const inner_radius = 24;
        const outer_radius = 17;

        this.bubbles = [[], []];

        for (let i = 0; i < this.angles[Globals.NumberBubbles].length; i++) {
            let angle = this.angles[Globals.NumberBubbles][i] * Math.PI / 180.0;
            let cx_inner = this.game.world.centerX + radii[0][Globals.NumberBubbles] * Math.sin(angle);
            let cy_inner = this.game.world.centerY - radii[0][Globals.NumberBubbles] * Math.cos(angle);

            let cx_outer = this.game.world.centerX + radii[1][Globals.NumberBubbles] * Math.sin(angle);
            let cy_outer = this.game.world.centerY - radii[1][Globals.NumberBubbles] * Math.cos(angle);

            let inner_num = this.answers[0][i];
            let outer_num = this.answers[1][i];

            this.bubbles[0].push(new Bubble(this.game, cx_inner, cy_inner, inner_radius, inner_num, true));
            this.bubbles[1].push(new Bubble(this.game, cx_outer, cy_outer, outer_radius, outer_num, false));
        }
    },

    genEquations: function() {
        let builtEq = [];
        let builtAns = [[], []];
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let length = (1 + Globals.NumberBubbles) * 4;
        let j =0;
        while (j < length) {
            let eq = '';

            let opIndex = this.game.rnd.integerInRange(0, this.operations.length - 1);
            let op = this.operations[opIndex];

            let num1 = (nums[this.game.rnd.integerInRange(0, nums.length - 1)]);
            let num2 = nums[this.game.rnd.integerInRange(0, (op === '-' ? num1 : nums.length)) - 1];
            let den1 = 1;
            let den2 = 1;
            let fractionalAns = false;
            if (this.fractions) {
                den1 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];
                den2 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];

                eq = '(' + num1 +  ' / ' + den1 + ') ' + op + ' (' + num2 + ' / ' + den2 + ')';
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
            let alreadyGenerated = builtEq.indexOf(eq) !== -1

            let count = 0;
            for (let ans of builtAns) {
                if (ans === result) {
                    count++;
                }
            }

            let tooMany = count > 2;

            if (Globals.GradeSel !== 4 && (divByZero || fractionalAns || notInt || alreadyGenerated || tooMany)) {
                continue;
            } else {
                j++
                if (this.fractions) {
                    builtAns[0].push('('+num1 + '/' + den1 + ')' + op);
                    builtAns[1].push('('+num2 + '/' + den2 + ')');
                } else {
                    builtAns[0].push(num1 + '' + op);
                    builtAns[1].push(''+num2);
                }
            }
        }
        this.shuffle(builtAns[0]);
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
                let str = "The question is: " + this.question + ".";
                if (this.selectedBubbles.length > 0) {
                    str += " You have: " + this.selectedBubbles[0];
                }
                if (this.selectedBubbles.length > 1) {
                    str += " and " + this.selectedBubbles[1];
                }
                str += ". Your score is: " + this.score;
                Speech.readEq(str);

                console.log('bub sel ',this.selectedBubbles);
                console.log('selected ', this.selectedIndicies);
                console.log('answers ', this.answers);
                console.log('bubbles ', this.bubbles);
            }, this);

            let S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            S.onDown.add(function() {
                Speech.read("Your score is: " + this.score);
            }, this);

            let F = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
            F.onDown.add(this.readBubbles, this);
        }

        let W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        W.onDown.add(this.Unsel, this);
    },

    bindEssentialKeys: function() {
        let ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        ESC.onDown.add(function() {
            if (Globals.MusicEnabled) {
                this.sounds['bgm'].stop();
            }
            this.game.state.start("bootMainMenu");
            if (Globals.ControlSel >= 2) {
                this.game.input.gamepad.start();
                this.gamepad = this.game.input.gamepad.pad1;
            }
        }, this);
    },

    rotateCW: function() {
        let selected_ring = (this.isInnerRing ? 0 : 1);
        tones.volume = (selected_ring < 1 ? 1.0 : 0.3);

        if (!this.won) {
            this.score_selectors++;

            do {
                this.bubbleSelection = (this.bubbleSelection + 1) % this.answers[0].length;
            } while (this.bubbles[selected_ring][this.bubbleSelection].popped);

            if (Globals.DictationEnabled) {
                Speech.readEq(this.answers[selected_ring][this.bubbleSelection]);
            }

            if (Globals.SoundEnabled) {
                tones.play(this.notes[this.bubbleSelection], this.octaves[selected_ring][this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

            for (let bubble of this.bubbles[selected_ring]) {
                bubble.selected = false;
                if (bubble === this.bubbles[selected_ring][this.bubbleSelection]) {
                    bubble.selected = true;
                }
                bubble.shrink();
                if (bubble.selected) {
                    bubble.enlarge();
                }
            }
        }
    },

    rotateCCW: function() {
        let selected_ring = (this.isInnerRing ? 0 : 1);
        tones.volume = (selected_ring < 1 ? 1.0 : 0.3);

        if (!this.won) {
            this.score_selectors++;

            do {
                if (this.bubbleSelection-1 < 0) {
                    this.bubbleSelection = this.answers[0].length - 1;
                } else {
                    this.bubbleSelection = this.bubbleSelection - 1;
                }
            } while (this.bubbles[selected_ring][this.bubbleSelection].popped);

            if (Globals.DictationEnabled) {
                Speech.readEq(this.answers[selected_ring][this.bubbleSelection]);
            }

            if (Globals.SoundEnabled) {
                tones.play(this.notes[this.bubbleSelection], this.octaves[selected_ring][this.bubbleSelection]);
            }

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);

            for (let bubble of this.bubbles[selected_ring]) {
                bubble.selected = false;
                if (bubble === this.bubbles[selected_ring][this.bubbleSelection]) {
                    bubble.selected = true;
                }
                bubble.shrink();
                if (bubble.selected) {
                    bubble.enlarge();
                }
            }
        }
    },

    Unsel: function() {
        if (this.selectedIndicies.length > 0) {
            this.bubbles[0][this.selectedIndicies[0]].chosen = false;
            this.selectedIndicies = [];
            this.selectedBubbles = [];
            this.isInnerRing = true;
        }

        if (Globals.DictationEnabled) {
            Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);
        }
    },

    Select: function() {
        if (this.answerIndex === this.answers[0].length) {
            this.initializeNewGame();
            this.wand.rotateTo(0);
            return;
        } else if (this.selectedBubbles.length == 1) {
            let result = eval(''+this.selectedBubbles[0] + this.answers[1][this.bubbleSelection]);
            this.selectedIndicies.push(this.bubbleSelection);
            let given = eval(this.question);
            if (result === given) {
                // Score stuff
                this.score += ((200) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
                this.score_multiplier =  Math.min(20, this.score_multiplier + 1);
                this.score_selectors = 0;

                // Animation stuff
                this.bubbles[0][this.selectedIndicies[0]].sprite.animations.play('bubble-pop');
                this.bubbles[0][this.selectedIndicies[0]].popped = true;
                this.bubbles[0][this.selectedIndicies[0]].numText.visible = false;
                if (this.bubbles[0][this.selectedIndicies[0]].opText) {
                    this.bubbles[0][this.selectedIndicies[0]].opText.visible = false;
                }

                this.bubbles[1][this.selectedIndicies[1]].sprite.animations.play('bubble-pop');
                this.bubbles[1][this.selectedIndicies[1]].popped = true;
                this.bubbles[1][this.selectedIndicies[1]].numText.visible = false;
                if (this.bubbles[1][this.selectedIndicies[1]].opText) {
                    this.bubbles[1][this.selectedIndicies[1]].opText.visible = false;
                }

                // Mechanics stuff  
                this.answerIndex ++;
                this.incorrectCounter = 0;

                this.updateProgressBar();

                if (Globals.SoundEnabled) {
                    this.sounds['pops'][this.game.rnd.integerInRange(0, this.sounds.pops.length - 1)].play();
                }
                if (this.answerIndex === this.answers[0].length) {
                    if (Globals.SoundEnabled) {
                        this.sounds['win'].play();
                    }
                    this.won = true;
                    return;
                } else {
                    for(let index in this.bubbles[0]) {
                        if(!this.bubbles[0][index].popped)
                        {
                            this.bubbleSelection = index;
                            this.wand.rotateTo(this.angles[Globals.NumberBubbles][index]);
                            break;
                        }
                    }
                    
                    this.selectQuestion();
                }

                if (Globals.DictationEnabled) {
                    Speech.readEq(this.question);
                }

                this.isInnerRing = true;

                this.selectedBubbles = [];
                this.selectedIndicies = [];
            } else {
                this.selectedBubbles = [];
                this.selectedIndicies = [];

                for (let i = 0; i < 2; i++) {
                    for (let bubble of this.bubbles[i]) {
                        bubble.chosen = false;
                    }
                }

                if (Globals.SoundEnabled) {
                    this.sounds['wrong'].play();
                }
                if (Globals.DictationEnabled) {
                    if (this.incorrectCounter < 2) {
                        if (given > result) {
                            Speech.read("Too small, try again");
                        } else {
                            Speech.read("Too large, try again");
                        }
                    } else {
                        this.suggestSolution(given);
                    }
                }
                this.score_multiplier = 1;
                this.incorrectCounter++;
                this.isInnerRing = true;
            }
        } else {
            this.selectedIndicies.push(this.bubbleSelection);
            this.selectedBubbles.push(this.answers[0][this.bubbleSelection]);
            this.isInnerRing = false;

            this.bubbles[0][this.bubbleSelection].chosen = true;
            if(this.bubbles[1][this.bubbleSelection].popped) {
                for(let index in this.bubbles[1])  {
                    if(!this.bubbles[1][index].popped)
                    {
                        this.bubbleSelection = index;
                        this.wand.rotateTo(this.angles[Globals.NumberBubbles][index]);
                        break;
                    }
                }
            }


            if (Globals.DictationEnabled) {
                Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);
            }
        }
    },

    selectQuestion: function() {
        this.killIterations++;
        let b1Index = this.game.rnd.integerInRange(0, this.bubbles[0].length - 1)
        let bubble1 = this.bubbles[0][b1Index];

        let possibAnswer = false;
        for(let bubble1_Index in this.bubbles[0]) {
            let bubble1 = this.bubbles[0][bubble1_Index];
            if(bubble1.popped)
                continue;
            for(let bubble2_Index in this.bubbles[1]) {
                let bubble2 = this.bubbles[1][bubble2_Index];
                if(bubble2.popped)
                    continue;
                let answer = eval(this.answers[0][bubble1_Index] + ' ' + this.answers[1][bubble2_Index]);
                if(Number.isInteger(answer))
                    possibAnswer = true;

            }
        }

        if(Globals.GradeSel !== 4 && !possibAnswer)  {

            for(let bubble1 of this.bubbles[0]) {
                if(!bubble1.popped) {
                        bubble1.sprite.animations.play('bubble-pop');
                        bubble1.popped = true;
                        bubble1.numText.visible = false;
                        if (bubble1.opText) {
                            bubble1.opText.visible = false;
                        }
                }
            }

            for(let bubble2 of this.bubbles[1]) {
                    if(!bubble2.popped)
                    {
                        bubble2.sprite.animations.play('bubble-pop');
                        bubble2.popped = true;
                        bubble2.numText.visible = false;
                        if (bubble2.opText) {
                            bubble2.opText.visible = false;
                        }
                    }
            }

            this.won = true;
            this.updateProgressBar();
            this.sounds['win'].play();
            return;
        }
        let isInt = false;
        let answer = null;

        while(!isInt) {
            let b1Index = this.game.rnd.integerInRange(0, this.bubbles[0].length - 1);
            let bubble1 = this.bubbles[0][b1Index];
            while (bubble1.popped) {
                b1Index = this.game.rnd.integerInRange(0, this.bubbles[0].length - 1)
                bubble1 = this.bubbles[0][b1Index];
            }

            let b2Index = this.game.rnd.integerInRange(0, this.bubbles[1].length - 1);
            let bubble2 = this.bubbles[1][b2Index];

            while (bubble2.popped) {
                b2Index = this.game.rnd.integerInRange(0, this.bubbles[1].length - 1)
                bubble2 = this.bubbles[1][b2Index];
            }

            answer = eval(this.answers[0][b1Index] + ' ' + this.answers[1][b2Index]);

            isInt = Number.isInteger(answer);
            if(Globals.GradeSel === 4) 
                break;
        }


        this.question = ''+answer;

        return answer;
    },

    suggestSolution: async function(given) {
        for (let inner_bubble of this.bubbles[0]) {
            for (let outer_bubble of this.bubbles[1]) {
                if (!inner_bubble.popped && !outer_bubble.popped) {
                    if (eval(inner_bubble.numText.text + outer_bubble.numText.text) === given) {
                        Speech.read("Try this: ");
                        await this.sleep(700).then(() => {
                            Speech.readEq(inner_bubble.numText.text + outer_bubble.numText.text + ' = ' + given);
                        });
                        return;
                    }
                }
            }
        }
    },

    bindSwitch: function() {
        this.interval = setInterval(() => this.rotateCW(), Globals.SwitchInterval);

        let S = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        S.onDown.add(this.Select, this);
    },

    bindDictationKeys: function() {
        let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(Speech.decreaseRate);

        let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(Speech.increaseRate);
    },

    processAnalog: function(angle, scheme_id) {
        let selected_ring = (this.isInnerRing ? 0 : 1);
        tones.volume = (selected_ring < 1 ? 1.0 : 0.3);
        
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
                if (this.bubbleSelection !== newBubble && !this.bubbles[selected_ring][newBubble].popped) {
                    this.bubbleSelection = newBubble;
                    this.wand.rotateTo(this.angles[Globals.NumberBubbles][newBubble]);
                    if (Globals.DictationEnabled) { 
                        Speech.readEq(this.answers[selected_ring][this.bubbleSelection]);
                    }
                    if (Globals.SoundEnabled) {
                        tones.play(this.notes[this.bubbleSelection], this.octaves[selected_ring][this.bubbleSelection]);
                    }
                }
        } else if(Globals.ControlSel === 1) {
            return null;
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
        } else if(Globals.ControlSel === 1)  {

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

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_BACK, 20)) {
            console.info("BACK");
            if (Globals.DictationEnabled) {
                Speech.readEq(this.questions[this.questionIndex]);
            }
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_START, 20)) {
            console.info("START");
            this.game.input.gamepad.stop();
            if(Globals.MusicEnabled)
                this.sounds['bgm'].stop();
            this.game.state.start("bootMainMenu");
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_B, 20) && !this.won) {
            console.info("B Button");
            this.Unsel();
        }

        if (this.gamepad.justPressed(Phaser.Gamepad.XBOX360_Y, 200) && !this.won) {
            let str = "The question is: " + this.question + ".";
            if (this.selectedBubbles.length > 0) {
                str += " You have: " + this.selectedBubbles[0];
            }
            if (this.selectedBubbles.length > 1) {
                str += " and " + this.selectedBubbles[1];
            }
            str += ". Your score is: " + this.score;
            Speech.readEq(str);
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

        if(this.won) {
            this.initializeNewGame();
            this.won = !this.won;
        }

        if (this.answerIndex < this.answers[0].length) {
            this.updateBubbleColors();
            this.updateBubbleAlphas();
            this.updateGFX();
        }

        if (this.answerIndex == this.answers[0].length) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        }

        if (Globals.ControlSel === 2) {
            this.bindControllerScheme(0);
        } else if (Globals.ControlSel === 3) {
            this.bindControllerScheme(1);
        } else if(Globals.ControlSel === 1) {
            this.bindControllerScheme(2);
        }
    },

    updateBubbleColors: function() {
        for (let i = 0; i < this.bubbles[0].length; i++) {
            for (let j = 0; j <= 1; j++) {
                if (this.bubbles[j][i].popped) {
                    this.bubbles[j][i].numText.fill = Globals.colors.popped;
                    if (this.bubbles[j][i].opText) {
                        this.bubbles[j][i].opText.fill = Globals.colors.popped;
                    }
                } else if (this.bubbles[j][i].chosen) {
                    this.bubbles[j][i].numText.fill = Globals.colors.chosen;
                    if (this.bubbles[j][i].opText) {
                        this.bubbles[j][i].opText.fill = Globals.colors.chosen;
                    }
                } else {
                    this.bubbles[j][i].numText.fill = Globals.colors.unselected;
                    if (this.bubbles[j][i].opText) {
                        this.bubbles[j][i].opText.fill = Globals.colors.unselected;
                    }
                }
            }
        }

        let ring_idx = (this.isInnerRing ? 0 : 1);

        if (this.bubbles[ring_idx][this.bubbleSelection].popped) {
            this.bubbles[ring_idx][this.bubbleSelection].numText.fill = Globals.colors.popped;
            if (this.bubbles[ring_idx][this.bubbleSelection].opText) {
                this.bubbles[ring_idx][this.bubbleSelection].opText.fill = Globals.colors.popped;
            }
        } else if (this.bubbles[ring_idx][this.bubbleSelection].chosen) {
            this.bubbles[ring_idx][this.bubbleSelection].numText.fill = Globals.colors.chosen;
            if (this.bubbles[ring_idx][this.bubbleSelection].opText) {
                this.bubbles[ring_idx][this.bubbleSelection].opText.fill = Globals.colors.chosen;
            }
        } else {
            this.bubbles[ring_idx][this.bubbleSelection].numText.fill = Globals.colors.selected;
            if (this.bubbles[ring_idx][this.bubbleSelection].opText) {
                this.bubbles[ring_idx][this.bubbleSelection].opText.fill = Globals.colors.selected;
            }
        }
    },

    updateBubbleAlphas: function() {
        let selected_ring = (this.isInnerRing ? 0 : 1);
        let unselected_ring = (this.isInnerRing ? 1 : 0);

        let selected_alpha = 1.0;
        let unselected_alpha = 0.4;

        for (let i = 0; i < this.bubbles[0].length; i++) {
            this.bubbles[unselected_ring][i].sprite.alpha = unselected_alpha;
            this.bubbles[unselected_ring][i].numText.alpha = unselected_alpha;
            if (this.bubbles[unselected_ring][i].opText) {
                this.bubbles[unselected_ring][i].opText.alpha = unselected_alpha;
            }

            this.bubbles[selected_ring][i].sprite.alpha = selected_alpha;
            this.bubbles[selected_ring][i].numText.alpha = selected_alpha;
            if (this.bubbles[selected_ring][i].opText) {
                this.bubbles[selected_ring][i].opText.alpha = selected_alpha;
            }
        }
    },

    updateProgressBar: function() {
        if (!this.won) {
            this.text.progress.setText("Progress: " + String(this.answerIndex) + "/" + String(this.answers[0].length));
        } else {
            this.text.progress.setText("Progress: " + String(this.answers[0].length) + "/" + String(this.answers[0].length));
        }
        this.progressBar.clear();
        this.progressBar = game.add.graphics(675,-325);
        this.progressBar.lineStyle(2, '0x000000');
        this.progressBar.beginFill('0xeeeeee',1);
        this.progressBar.drawRoundedRect(100,500,200,35,20);
        this.progressBar.endFill();
        this.progressBar.beginFill('0x8CE9FF',1);
        this.progressBar.drawRoundedRect(101,501,198/this.answers[0].length*this.answerIndex,33,20);
        this.progressBar.endFill();
    },

    readBubbles: async function() {
        let delay = 900 * (1 + Math.round(Globals.voice.rate / 2.0));
        let ring_delay = 450 * (1 + Math.round(Globals.voice.rate / 2.0));
        let count = 0;
        let outer_count = 0;
        let bubble_text = [];
        let tone_index = [];
        let outer_bubble_text = [];
        let outer_tone_index = [];
        for (let i = 0; i < this.bubbles[0].length; i++) {
            if (!this.bubbles[0][i].popped) {
                count++;
                bubble_text.push(String(this.bubbles[0][i].numText.text));
                tone_index.push(i);
            }
            if (!this.bubbles[1][i].popped) {
                outer_count++;
                outer_bubble_text.push(String(this.bubbles[1][i].numText.text));
                outer_tone_index.push(i);
            }
        }
        Speech.read("The remaining: " + String(count) + ".. numbers with operators are: ");
        await this.sleep(delay);
        for (let i = 0; i < bubble_text.length; i++) {
            await this.sleep(ring_delay).then(() => {
                if (Globals.SoundEnabled) {
                    tones.play(this.notes[tone_index[i]], this.octaves[0][tone_index[i]]);
                }
                if (Globals.DictationEnabled) {
                    Speech.readEq(String(bubble_text[i]));
                }
            });
        }
        await this.sleep(delay);
        Speech.read("And the remaining: " + String(outer_count) + ".. numbers are: ");
        tones.volume = 0.8;
        await this.sleep(delay);
        for (let i = 0; i < outer_bubble_text.length; i++) {
            await this.sleep(ring_delay).then(() => {
                if (Globals.SoundEnabled) {
                    tones.play(this.notes[outer_tone_index[i]], this.octaves[1][outer_tone_index[i]]);
                }
                if (Globals.DictationEnabled) {
                    Speech.readEq(String(outer_bubble_text[i]));
                }
            });
        }
        tones.volume = 1.0;
    },

    sleep: function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    },
}
