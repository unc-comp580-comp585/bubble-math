var gamemode2 = function(game) {

};

gamemode2.prototype = {





    sounds: {},

    //graphics
    bubbles: [[], []],
    text : {},
    wand: null,

    //mechanics
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

    //score
    score : 0,
    score_multiplier: 0,
    score_selectors: 0,

    angles: [
            [0, 90, 180, 270], 
            [0, 45, 90, 135, 180, 225, 270, 315],
            [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
        ],


    interval: null,

    preload: function() {


        //score shit
        this.score = 0;
        this.score_multiplier = 1;
        this.score_selectors = 0;

        this.loadGFXAssets();
        this.loadSFXAssets();
    },

    loadGFXAssets: function() {
        //load background
        this.game.load.image('bg', 'assets/images/background.png').volume;

        // Bunny
        this.game.load.image('usagi', 'assets/images/bunny.png');

        //bubble
        this.game.load.image('bubble', 'assets/images/bubble.png');

        //wand
        this.game.load.image('wand', 'assets/images/wand.png');

        //bubble popping
        this.game.load.spritesheet('bubble-pop', 'assets/sheets/bubble-popping.png', 256, 256);
        
        //usagi jumping
        this.game.load.spritesheet('usagi-jump', 'assets/sheets/bunny-jump.png', 256, 256);
    },

    loadSFXAssets: function() {
        
        if(Globals.MusicEnabled)
            //music
            this.game.load.audio('bgm', 'assets/audio/8bit_bg.wav');

        if(Globals.SoundEnabled) {
            //pop sounds
            this.game.load.audio('pop_1', 'assets/audio/bubble-pop-1.mp3');
            this.game.load.audio('pop_2', 'assets/audio/bubble-pop-2.mp3');
            this.game.load.audio('pop_3', 'assets/audio/bubble-pop-3.mp3');
        
            //transition sounds
            this.game.load.audio('short_1', 'assets/audio/short-bubbles-1.mp3');
            this.game.load.audio('short_2', 'assets/audio/short-bubbles-2.mp3');
            this.game.load.audio('short_3', 'assets/audio/short-bubbles-3.mp3');
            this.game.load.audio('short_4', 'assets/audio/short-bubbles-4.mp3');

            //incorrect noise
            this.game.load.audio('wrong', 'assets/audio/wrong-1.mp3');

            //you won hooooraaaay
            this.game.load.audio('win', 'assets/audio/achievement.mp3');
        }
    },

    addSFXAssets: function() {
        if(Globals.MusicEnabled) {
            this.sounds['bgm'] = this.game.add.audio('bgm');
            this.sounds['bgm'].loop = true;
            this.sounds['bgm'].volume = 0.25;
        }
        
        if(Globals.SoundEnabled) {
            //Popping Sounds
            this.sounds['pops'] = [];
            this.sounds['pops'].push(this.game.add.audio('pop_1'));
            this.sounds['pops'].push(this.game.add.audio('pop_2'));
            this.sounds['pops'].push(this.game.add.audio('pop_3'));

            //Transition Sounds
            this.sounds['trans'] = [];
            this.sounds['trans'].push(this.game.add.audio('short_1'));
            this.sounds['trans'].push(this.game.add.audio('short_2'));
            this.sounds['trans'].push(this.game.add.audio('short_3'));
            this.sounds['trans'].push(this.game.add.audio('short_4'));

            //Wrong Sound
            this.sounds['wrong'] = this.game.add.audio('wrong');

            //Win Sound
            this.sounds['win'] = this.game.add.audio('win');

            for(let snd of this.sounds['trans'])
                snd.volume = 0.4;

            this.sounds['win'].volume = 0.3;
            this.sounds['wrong'].volume = 0.3;
        }
    },

    create: function() {

        this.addSFXAssets();


        if(Globals.MusicEnabled) {
            this.sounds['bgm'].play();
        }

        if(Globals.ControlSel === 0) {
            this.bindKeys();
            if(Globals.DictationEnabled) 
                this.bindSpeechKeys();
        }

        this.bindEssentialKeys();

        this.initializeNewGame();
    },

    initializeNewGame: function() {
        //TODO
        this.drawGFX();

        this.operations = Globals.GradeSel >= 2 ? ['+', '-', '*', '/'] : ['+', '-'];
        this.fractions = Globals.GradeSel % 2 == 1;

            
        this.answerIndex = 0;


        this.bubbleSelection = 0;

        this.won = false;


        this.genEquations();

        this.drawBubbles();

        this.selectQuestion();

        this.updateGFX();

        this.isInnerRing = true;
        this.selectedBubbles = [];
        this.selectedIndicies = [];
        
        if(Globals.DictationEnabled)
            Speech.readEq(this.question);

        if(Globals.ControlSel === 1) {
            this.bindSwitch();
            if(Globals.DictationEnabled) 
                this.bindSpeechKeys();
        }
    },

    updateGFX: function() {
        this.text.score.setText("Score: " + this.score);
        this.text.multiplier.setText("x" + this.score_multiplier);
        this.text.question.setText(this.question);
    },

    drawGFX: function() {
        let w = this.game.world.width;
        let h = this.game.world.height;
        let bg = this.game.add.sprite(w/2, h/2, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.width = w;
        bg.height = h;

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
        this.bubbles = [[], []];
        const radii = [
            [70, 100, 130],
            [130, 160, 190]
        ];
        const radius = 15;

        for(let i = 0; i < this.angles[Globals.NumberBubbles].length; i++) {
            let angle = this.angles[Globals.NumberBubbles][i] * Math.PI / 180.0;
            let cx_inner = this.game.world.centerX + radii[0][Globals.NumberBubbles] * Math.sin(angle);
            let cy_inner = this.game.world.centerY - radii[0][Globals.NumberBubbles] * Math.cos(angle);

            let cx_outer = this.game.world.centerX + radii[1][Globals.NumberBubbles] * Math.sin(angle);
            let cy_outer = this.game.world.centerY - radii[1][Globals.NumberBubbles] * Math.cos(angle);
            
            let inner_num = this.answers[0][i];
            let outer_num = this.answers[1][i];

            this.bubbles[0].push(new Bubble(this.game, cx_inner, cy_inner, radius, inner_num));
            this.bubbles[1].push(new Bubble(this.game, cx_outer, cy_outer, radius, outer_num));
        }
    },

    genEquations: function() {
        let builtEq = [];
        let builtAns = [[], []];
        const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let length = (1 + Globals.NumberBubbles) * 4;
        let j =0;
        while(j < length) {
            let eq = '';

            
            let opIndex = this.game.rnd.integerInRange(0, this.operations.length - 1);
            let op = this.operations[opIndex];
            
            let num1 = (nums[this.game.rnd.integerInRange(0, nums.length - 1)]);
            let num2 = nums[this.game.rnd.integerInRange(0, (op === '-' ? num1 : nums.length)) - 1];
            let den1 = 1;
            let den2 = 1;
            let fractionalAns = false;
            if(this.fractions) {
                den1 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];
                den2 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];

                eq = '(' + num1 +  ' / ' + den1 + ') ' + op + ' (' + num2 + ' / ' + den2 + ')';
                fractionalAns = (num2 / den2) > (num1 / den1) && op === '/';
            } else 
                eq = '' + num1 + ' ' + op + ' ' + num2;
            
            let result = (num1 / den1);

            if(op === '+')
                result += (num2 / den2);
            else if(op === '-')
                result -= (num2 / den2);
            else if(op === '*')
                result *= (num2 / den2);
            else if(op === '/')
                result /= (num2 / den2);
        
            let divByZero = num2 === 0 && op === '/';
            let notInt = !Number.isInteger(result);
            let alreadyGenerated = builtEq.indexOf(eq) !== -1;


            let count = 0;
            for(let ans of builtAns)
                if(ans === result)
                    count++;
            
            let tooMany = count > 2;

            if(divByZero || fractionalAns || notInt || alreadyGenerated || tooMany)
                continue;
            else {
                j++
                if(this.fractions) {
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
        let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(this.rotateCCW, this);

        let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(this.rotateCW, this);

        let SPACE = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        SPACE.onDown.add(this.Select, this);

        if(Globals.DictationEnabled) {
            let R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            R.onDown.add(function() {
                    let str = "The question is: " + this.question + ".";
                    
                    if(this.selectedBubbles.length > 0)
                        str += " You have: " + this.selectedBubbles[0];
                    
                    if(this.selectedBubbles.length > 1)
                        str += " and " + this.selectedBubbles[1];
                    Speech.readEq(str);

                    console.log('bub sel ',this.selectedBubbles);
                    console.log('selected ', this.selectedIndicies);
                    console.log('answers ', this.answers);
                    console.log('bubbles ', this.bubbles);
            }, this);
            let S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            S.onDown.add(function(){
                Speech.read("Your score is: " + this.score);
            }, this);
            let A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            A.onDown.add(function(){
                Globals.voice.rate += 0.1;
            }, this);
            let D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            D.onDown.add(function(){
                Globals.voice.rate -= 0.1;
            });
        }

        let W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        W.onDown.add(this.Unsel, this);
    },

    bindEssentialKeys: function() {
        let ESC = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        ESC.onDown.add(function() {
            this.game.sound.stopAll();
            this.game.state.start("bootMainMenu");
        }, this);   
    },

    rotateCW: function() {
        if (!this.won) {
            this.score_selectors++;

            if(Globals.SoundEnabled)
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();

            do {
                this.bubbleSelection = (this.bubbleSelection + 1) % this.answers[0].length;
            } while (this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].popped);

            if(Globals.DictationEnabled)
                Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);
        }
    },

    rotateCCW: function() {
        if (!this.won) {
            this.score_selectors++;

            if(Globals.SoundEnabled)
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();

            do {
                if (this.bubbleSelection-1 < 0) {
                    this.bubbleSelection = this.answers[0].length - 1;
                } else {
                    this.bubbleSelection = this.bubbleSelection - 1;
                }
            } while (this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].popped);

            if(Globals.DictationEnabled)
                Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);
        }
    },

    Unsel: function() {
        if(this.selectedIndicies.length > 0)
        {
            this.bubbles[0][this.selectedIndicies[0]].chosen = false;
            this.selectedIndicies = [];
            this.selectedBubbles = [];
            this.isInnerRing = true;
        }
        if(Globals.DictationEnabled)
            Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);
    },

    Select: function() {
        //TODO
        if(this.answerIndex === this.answers[0].length) {
            this.initializeNewGame();
            this.wand.rotateTo(0);
            return;
        }
        if(this.selectedBubbles.length == 1) {
            let result = eval(''+this.selectedBubbles[0] + this.answers[1][this.bubbleSelection]);
            this.selectedIndicies.push(this.bubbleSelection);
            if(result === eval(this.question)){
                //score stuff
                this.score += ((200) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
                this.score_multiplier ++;
                this.score_selectors = 0;

                //animation stuff
                this.bubbles[0][this.selectedIndicies[0]].sprite.animations.play('bubble-pop');
                this.bubbles[0][this.selectedIndicies[0]].popped = true;
                this.bubbles[0][this.selectedIndicies[0]].numText.visible = false;

                this.bubbles[1][this.selectedIndicies[1]].sprite.animations.play('bubble-pop');
                this.bubbles[1][this.selectedIndicies[1]].popped = true;
                this.bubbles[1][this.selectedIndicies[1]].numText.visible = false;

                //mechanics stuff
                this.answerIndex ++;
                this.incorrectCounter = 0;


                if(Globals.SoundEnabled)
                    this.sounds['pops'][this.game.rnd.integerInRange(0, this.sounds.pops.length - 1)].play();

                if(this.answerIndex === this.answers[0].length) {
                    if(Globals.SoundEnabled)
                        this.sounds['win'].play();
                    this.won = true;
                    return;
                } else {
                    this.selectQuestion();
                }

                if(Globals.DictationEnabled)
                    Speech.readEq(this.question);
                
                this.isInnerRing = true;

                this.selectedBubbles = [];
                this.selectedIndicies = [];
            } else {
                this.selectedBubbles = [];
                this.selectedIndicies = [];

                if(Globals.SoundEnabled)
                    this.sounds['wrong'].play();

                this.score_multiplier = 1;
                this.incorrectCounter++;
                this.isInnerRing = true;
            }
        } else {
            this.selectedIndicies.push(this.bubbleSelection);
            this.selectedBubbles.push(this.answers[0][this.bubbleSelection]);
            this.isInnerRing = false;

            if(Globals.DictationEnabled)
                Speech.readEq(this.answers[this.isInnerRing ? 0 : 1][this.bubbleSelection]);
        }
    },

    selectQuestion: function() {
        let b1Index = this.game.rnd.integerInRange(0, this.bubbles[0].length - 1)
        let bubble1 = this.bubbles[0][b1Index];
        
        while(bubble1.popped) {
            b1Index = this.game.rnd.integerInRange(0, this.bubbles[0].length - 1)
            bubble1 = this.bubbles[0][b1Index];
        }

        let b2Index = this.game.rnd.integerInRange(0, this.bubbles[1].length - 1);
        let bubble2 = this.bubbles[1][b2Index];

        while(bubble2.popped) {
            b2Index = this.game.rnd.integerInRange(0, this.bubbles[1].length - 1)
            bubble2 = this.bubbles[1][b2Index];
        }

        let answer = eval(this.answers[0][b1Index] + ' ' + this.answers[1][b2Index]);

        this.question = ''+answer;

        return answer;
    },

    bindSwitch: function() {
        this.interval = setInterval(() => this.rotateCW(), 1000);

        let S = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        S.onDown.add(this.Select, this);
    }, 

    bindSpeechKeys: function() {
        //TODO SpeechRecognition
    },

    bindControllerScheme: function(scheme_id) {
        //TODO
    },

    update: function() {

        if(this.answerIndex < this.answers[0].length) {
            this.updateBubbleColors();
            this.updateBubbleAlphas();
            this.updateGFX();
        }

        if(this.answerIndex == this.answers[0].length)
            if(this.interval !== null)
                clearInterval(this.interval);


        if(Globals.ControlSel === 2)
            this.bindControllerScheme(0);
        else if(Globals.ControlSel === 3)
            this.bindControllerScheme(1);
    },

    updateBubbleColors: function() {
        for (let i = 0; i < this.bubbles[0].length; i++) {
            for (let j = 0; j <= 1; j++) {
                if (this.bubbles[j][i].popped) {
                    this.bubbles[j][i].numText.fill = '#000000';
                } else if (this.bubbles[j][i].chosen) {
                    this.bubbles[j][i].numText.fill = '#ffff00';
                } else {
                    this.bubbles[j][i].numText.fill = '#ffffff';
                }
            }
        }

        if (this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].popped) {
            this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].numText.fill = '#000000';
        } else if (this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].chosen) {
            this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].numText.fill = '#ffff00';
        } else {
            this.bubbles[this.isInnerRing ? 0 : 1][this.bubbleSelection].numText.fill = '#ffff00';
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

                this.bubbles[selected_ring][i].sprite.alpha = selected_alpha;
                this.bubbles[selected_ring][i].numText.alpha = selected_alpha;
            }
    },
}
