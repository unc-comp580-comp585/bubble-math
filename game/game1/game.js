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

    //graphics
    bubbles: [],
    text : {},
    wand: null,

    bubbleSelection: 0,
    questionIndex: 0,
    incorrectCounter: 0,
    won: false,

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

        this.questionIndex = 0;


        this.bubbleSelection = 0;

        this.won = false;


        this.genEquations();

        this.drawBubbles();

        this.updateGFX();
        
        if(Globals.DictationEnabled)
            Speech.readEq(this.questions[this.questionIndex]);

        if(Globals.ControlSel === 1) {
            this.bindSwitch();
            if(Globals.DictationEnabled) 
                this.bindSpeechKeys();
        }
    },

    updateGFX: function() {
        this.text.score.setText("Score: " + this.score);
        this.text.multiplier.setText("x" + this.score_multiplier);
        this.text.question.setText(this.questions[this.questionIndex]);
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
        this.bubbles = [];
        const radii = [70, 100, 130];
        const radius = 15;

        for(let i = 0; i < this.angles[Globals.NumberBubbles].length; i++) {
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
        while(j < length) {
            let eq = '';

            
            let opIndex = this.game.rnd.integerInRange(0, this.operations.length - 1);
            let op = this.operations[opIndex];
            
            let num1 = nums[this.game.rnd.integerInRange(0, nums.length - 1)];
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
            this.game.state.start("bootMainMenu");
        }, this);   
    },

    bindKeys: function() {
        let Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(this.rotateCCW, this);

        let E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(this.rotateCW, this);

        let S = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        S.onDown.add(this.Select, this);

        if(Globals.DictationEnabled) {
            let R = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
            R.onDown.add(function() {
                    Speech.readEq("The question is: " + this.questions[this.questionIndex] + ".");
            }, this);
            let S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            S.onDown.add(function(){
                    Speech.read("Your score is: " + this.score);
            }, this);
        }
    },

    rotateCW: function() {
        if (!this.won) {
            this.score_selectors++;

            if(Globals.SoundEnabled)
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();

            do {
                this.bubbleSelection = (this.bubbleSelection + 1) % this.questions.length;
            } while(this.bubbles[this.bubbleSelection].popped)

            if(Globals.DictationEnabled)
                Speech.read(this.answers[this.bubbleSelection]);

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);
        }
    },

    rotateCCW: function() {
        if (!this.won) {
            this.score_selectors++;

            if(Globals.SoundEnabled)
                this.sounds.trans[this.game.rnd.integerInRange(0, this.sounds.trans.length - 1)].play();

            do {
                if(this.bubbleSelection - 1 < 0)
                    this.bubbleSelection = this.questions.length - 1;
                else
                    this.bubbleSelection = this.bubbleSelection - 1;
            } while(this.bubbles[this.bubbleSelection].popped)

            if(Globals.DictationEnabled)
                Speech.read(this.answers[this.bubbleSelection]);

            this.wand.rotateTo(this.angles[Globals.NumberBubbles][this.bubbleSelection]);
        }
    },

    Select: function() {
        if(this.won) {
            this.initializeNewGame();
            this.wand.rotateTo(0);
            return;
        }

        let result = eval(this.questions[this.questionIndex]);
        let given = eval(this.answers[this.bubbleSelection])
        if(given === result) {
            //score stuff
            this.score += ((100) * this.score_multiplier) * Math.max(1, 12 - this.score_selectors);
            this.score_multiplier += 1;
            this.score_selectors = 0;

            //animation stuff
            this.bubbles[this.bubbleSelection].sprite.animations.play('bubble-pop');
            this.bubbles[this.bubbleSelection].popped = true;
            this.bubbles[this.bubbleSelection].numText.visible = false;

            //mechanics stuff
            this.questionIndex ++;
            this.incorrectCounter = 0;

            if(Globals.SoundEnabled)
                this.sounds['pops'][this.game.rnd.integerInRange(0, this.sounds.pops.length - 1)].play();

            if(this.questionIndex === this.questions.length) {
                if(Globals.SoundEnabled)
                    this.sounds['win'].play();
                this.won = true;
                return;
            }

            if(Globals.DictationEnabled)
                Speech.readEq(this.questions[this.questionIndex]);

        } else {
            
            if(Globals.SoundEnabled)
                this.sounds['wrong'].play();

            this.score_multiplier = 1;
            this.incorrectCounter++;
        }
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

        if(this.questionIndex < this.questions.length) {
            this.updateBubbleColors();
            this.updateGFX();
        }

        if(this.questionIndex == this.questions.length)
            if(this.interval !== null)
                clearInterval(this.interval);


        if(Globals.ControlSel === 2)
            this.bindControllerScheme(0);
        else if(Globals.ControlSel === 3)
            this.bindControllerScheme(1);
    },

    updateBubbleColors: function() {
        for(let i = 0; i < this.bubbles.length; i++) {
            if(this.bubbles[i].popped)
                this.bubbles[i].numText.fill = '#000000';
            else 
                this.bubbles[i].numText.fill = '#ffffff';
        }

        if(this.bubbles[this.bubbleSelection].popped)
            this.bubbles[this.bubbleSelection].numText.fill =  '#000000';
        else 
            this.bubbles[this.bubbleSelection].numText.fill = '#ffff00';
    }
}
