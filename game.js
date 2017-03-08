window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    // Distances of bubbles from center (indexed by difficulty)
    var radii = [70, 100, 130];

    // Wand dimensions (indexed by difficulty)
    var wand_dims = [
        { w: 40, h: 70  },
        { w: 60, h: 120 },
        { w: 80, h: 160 },
    ];

    //did the gamepad state change?
    var state_changed = false;

    // Mode [0-1]
    var game_mode = 0;

    //Fractions Enabled
    var fractions;

    //operations
    var ops;

    // BS1 Defines
    var cursor;

    //mapping of cursors -> answers
    var wheel_map;

    // question -> answer
    var equation_map;

    // Questions that have been answered
    var answered_questions;

    // Index of current question
    var question_index;

    //array of questions
    var questions;

    //array of answers
    var answers;

    // Keyboard fallbacks
    var Q;
    var E;
    var Space;
    var R;

    //Up Ring Modifier
    var Shift;

    //Down ring modifier
    var Ctrl;

    //I don't know what this is
    //something related to graphics
    var bubbles;

    var wand;

    //something related to graphics
    var question_text;

    //Whether the game is over or not to avoid looping win sound over and over
    //again
    var won;

    //Scorekeeping Information

    //global score
    var score;

    //'streak' multiplier
    var score_multiplier;

    //how many bubbles were considered
    //before selecting answers
    var score_selections;

    // Audio contexts
    var game_sounds = {};

    // Speech recognition object
    var recognition;

    //ring modifiers
    var down_level = false;
    var up_level = false;

    function preload() {
        game.load.image(Globals.handles.bubble, 'assets/images/bubble.png');
        game.load.image(Globals.handles.background, 'assets/images/background.png');
        game.load.image(Globals.handles.wand, 'assets/images/wand.png');

        game.load.spritesheet(Globals.handles.bubble_popping, 'assets/sheets/bubble-popping.png', 256, 256);

        score = 0;

        game_sounds = {};

        Sound.loadSounds(game, game_sounds);

        if (!('speechSynthesis' in window)) {
            Globals.dictation = false;
        }

    }

    function create() {
        initGame();

        game.input.gamepad.start();

        Sound.addSounds(game, game_sounds);
        recognition = Sound.initRecognition(recognition);

        Globals.gamepad = game.input.gamepad.pad1;

        // Select bubble clockwise from current
        Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(onQ, this);

        // Select bubble counterclockwise from current
        E = game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(onE, this);

        // Repeat question and current bubble
        R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        R.onDown.add(onR, this);

        // Increase speech rate
        A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(Sound.speechRate, this);

        // Decrease speech rate
        S = game.input.keyboard.addKey(Phaser.Keyboard.S);
        S.onDown.add(Sound.speechRate, this);

        // Start a speech recognition event
        T = game.input.keyboard.addKey(Phaser.Keyboard.T);
        T.onDown.add(onT, this);

        Shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        Shift.onDown.add(function() { up_level = true; }, this);
        Shift.onUp.add(function() { up_level = false; } , this);

        Ctrl = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        Ctrl.onDown.add(function() { down_level = true; }, this);
        Ctrl.onUp.add(function() { down_level = false; } , this);

        Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Space.onDown.add(onSpace, this);

        console.log("Questions: " + questions);
        console.log("Answers:   " + answers);
        console.debug("Bubbles: %o", bubbles);
        console.debug("Wheel: %o", wheel_map);
        console.debug("Sounds: %o", game_sounds);
    }

    function initGame() {
        Graphics.drawBackground(game);

        question_text = game.add.text(game.world.centerX, 100, "", {
            font: "bold 32px Courier",
            fill: "#ffffff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });
        question_text.anchor.setTo(0.5, 0.5);

        wheel_map = {};
        equation_map = {};
        answered_questions = {};
        question_index = 0;
        won = false;


        fractions = false;
        ops = ['+', '-'];
        if (Globals.grade >= 3) {
            ops.push('*');
            ops.push('/');
        }
        if (Globals.grade % 2 == 0) {
            fractions = true;
        }
        generate_wheel_map();

        generate_equations();

        cursor = 0;

        score = 0;

        score_selections = 0;

        score_multiplier = 1;

        question_text.setText(questions[question_index].trim());

        bubbles = Graphics.drawWheelMap(game, wheel_map[''+Globals.difficulty], answers, radii[Globals.difficulty]);
        bubbles[cursor].numText.fill = Globals.colors.selected;

        let wand_w = wand_dims[Globals.difficulty].w;
        let wand_h = wand_dims[Globals.difficulty].h;
        let angle = wheel_map[''+Globals.difficulty][cursor];
        wand = new Wand(game, game.world.centerX, game.world.centerY, wand_w, wand_h, angle);
    }

    // Display current question/answer
    function onR() {
        console.log("Question : "  + questions[question_index]);
        console.log("Current Answer: " + answers[cursor]);
        console.log("Modifiers: Up Ring["+up_level+"] Down Ring["+down_level+"]");
        console.log("Score: " + score);
        console.log("Score Multiplier: " + score_multiplier);
        console.log("Number of Selected Circles: " + score_selections);
        if (Globals.dictation) {
            Sound.readEquation("The question is: " + questions[question_index] + 
            '. Your bubble is: ' + answers[cursor]);
        }
    }

    // Rotate cursor CW
    function onQ() {
        decrease_cursor();
        updateBubbleText();
        wand.rotateTo(wheel_map[''+Globals.difficulty][cursor]);
        Sound.readEquation(answers[cursor]);
        Sound.play(game_sounds,'bubbles');
    }

    // Rotate cursor CCW
    function onE() {
        increase_cursor();
        updateBubbleText();
        wand.rotateTo(wheel_map[''+Globals.difficulty][cursor]);
        Sound.readEquation(answers[cursor]);
        Sound.play(game_sounds,'bubbles');
    }

    // Starts speech recognition
    function onT(){
        console.log(recognition);
        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var number = event.results[last][0].transcript;
            console.log('Result received: ' + number + '.');
            console.log('Confidence: ' + event.results[0][0].confidence);
            if (Number.isInteger(parseInt(number))){
                lock_in_answer(number);
            } else {
                lock_in_answer(Globals.numbers[number]);
            }
        }
        recognition.onspeechend = function() {
            console.log('Recognition finished.');
            recognition.stop();
        }
        recognition.onnomatch = function(event) {
            console.log('I didnt recognise that number.');
        }
        recognition.onerror = function(event) {
           console.log('Error occurred in recognition: ' + event.error);
        }
        Sound.startRecognition(recognition);
    }

    // Submit answer
    function onSpace() {
        if (!won) {
            lock_in_answer();
        } else {
            initGame();
        }
    }

    function update() {
        if (question_index  === questions.length) {
            question_text.setText("You win!");
            if(!won) {
                Sound.dictate('victory');
                Sound.play(game_sounds,'win');
                won = true;
            } 
            process_gamepad_buttons();
            return;
        }

        if (Globals.gamepadEnabled(game)) {
            process_gamepad_controls();
        }
        else
            state_changed = true;
    }

    function process_gamepad_controls() {
        process_left_joystick();
        process_gamepad_buttons();
    }

    function process_gamepad_buttons() {
        if (Globals.gamepad.justPressed(Phaser.Gamepad.XBOX360_A, 20) && cursor != -1 && !won) {
                lock_in_answer();
        }
        if(Globals.gamepad.justPressed(Phaser.Gamepad.XBOX360_X, 20) && won) {
                initGame();
        }
    }


    function lock_in_answer(spoken_answer) 
    {
        let spoken = (spoken_answer != undefined);
        let good = spoken && eval(questions[question_index]) == spoken_answer;
        good = good || (!spoken && eval(questions[question_index]) === answers[cursor] && !(cursor in answered_questions));
        if (good) {
            score += ((10000) * score_multiplier) * (Math.max(1, 20-score_selections));
            score_multiplier += 1;
            score_selections = 0;
            if (spoken) {
                for (var i = 0; i < bubbles.length; i++) {
                    if (bubbles[i].num == eval(questions[question_index]) && bubbles[i].popped == false) {
                        bubbles[i].sprite.animations.play(Globals.animations.pop);
                        bubbles[i].popped = true;
                        answered_questions[i] = true;
                        break;
                    }
                }
            } else {
                bubbles[cursor].sprite.animations.play(Globals.animations.pop);
                bubbles[cursor].popped = true;
                answered_questions[cursor] = true;
            }
            updateBubbleText();
            question_index += 1;

            if (question_index < questions.length) {
                question_text.setText(questions[question_index].trim());
            }
            if (Globals.dictation && !won && state_changed) 
            {
                Sound.dictate('correct');
            }
            if (Globals.soundfx && !won && state_changed) {
                Sound.play(game_sounds,'pop');
            }
            console.log("Correct!");
        } else if (cursor in answered_questions) {
            //is this possible now?
            console.log("answer: " + answers[cursor] + " @ cursor: " + cursor + " already used");
            // TODO: Add soundfx for this
        } else {
            if (Globals.dictation && !won && state_changed) {
                Sound.dictate('incorrect');
            }
            if (Globals.soundfx && !won && state_changed) {
                Sound.play(game_sounds, 'wrong');
            }
        }
    }

    function process_left_joystick() {
        let last_cursor = cursor;
        cursor = -1;
        let controller_moved_x = Math.abs(Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) > Globals.leftJSDeadZone;
        let controller_moved_y = Math.abs(Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)) > Globals.leftJSDeadZone;
        if (controller_moved_x || controller_moved_y) {
            let x =  Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            let y = -Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
            let tmp  = Math.atan2(y, x);
            if (y < 0) {
                tmp += 2 * Math.PI;
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)
                cursor -= 90;
            } else {
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)
                cursor -= 90;
            }
            cursor = Math.abs(cursor);
            state_changed = last_cursor != cursor;
            map_cursor_to_wheel(cursor);
        }
    }

    function map_cursor_to_wheel(cursor_val) {
        var wheel = wheel_map[''+Globals.difficulty]
        for (var i = 0; i < wheel.length; i++) {
            if (cursor_val <= wheel[i]) {
                cursor = i;
                return;
            }
        }
        cursor = 0;
        return;
    }

    function generate_wheel_map() {
        for (var coeff = 0; coeff < 3; coeff ++) {
            wheel_map[''+coeff] = [];
            var addition = Math.PI / ((2 * (coeff + 1)));
            for (var i = 0; i < 2 * Math.PI; i += addition) {
                var convert = i * (180 / Math.PI);
                wheel_map[''+coeff].push(convert);
            }
        }
    }

    function generate_equations() {
        let length = wheel_map[''+Globals.difficulty].length;
        let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        questions = [];
        answers = [];

        let fractions = false;
        let ops = ['+', '-'];
        if (Globals.grade >= 3) {
            ops.push('*');
            ops.push('/');
        }
        if (Globals.grade % 2 == 0) {
            fractions = true;
        }

        let j = 0;
        let gen_fraction = false;
        while (j < length) {

            if(fractions)
                gen_fraction = game.rnd.integerInRange(0, 1) == 0;
            let str = '';
            let numerator_1 = nums[game.rnd.integerInRange(0, nums.length - 1)];
            str += numerator_1;
            let denominator_1 = 1;
            if (gen_fraction) {
                denominator_1 =  nums[game.rnd.integerInRange(0, nums.length - 1)];
                str = '(' + numerator_1 + ' / ' + denominator_1 + ')';
            }
            let op = ops[game.rnd.integerInRange(0, ops.length - 1)];
            str += ' '+ op + ' ';
            let lower_bound = nums.length - 1;
            if (op === '-') {
                lower_bound = numerator_1;
            }
            let numerator_2 = nums[game.rnd.integerInRange(0, lower_bound)];
            // str += numerator_2 + ' ';
            let denominator_2 = 1;
            if (gen_fraction) {
                denominator_2 = nums[game.rnd.integerInRange(0, nums.length - 1)];
                str += '(' + numerator_2 + ' / ' + denominator_2 + ')';
            }
            else 
            {
                str += numerator_2 + ' ';
            }
            let result = eval(str);

            if (numerator_2 === 0 && op === '/') {
                continue;
            }
            if(result < 0)
                continue;
            if ((numerator_2 / denominator_2) > (numerator_1 / denominator_2) && op === '/')
                continue;
            if (!Number.isInteger(result)) {
                continue;
            }
            if (questions.indexOf(str) !== -1) {
                continue;
            } else {
                j++;
                questions.push(str);
                answers.push(result);
            }
        }
        shuffle_answers();
    }

    function shuffle_answers() {
        for (var i = answers.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = answers[i];
            answers[i] = answers[j];
            answers[j] = temp;
        }
    }

    function increase_cursor() {
        if (!won) {
            score_selections += 1;
            do {
                cursor = (cursor + 1) % answers.length;
            } while (bubbles[cursor].popped);
        }
    }

    function decrease_cursor() {
        if (!won) {
            score_selections += 1;
            do {
                if (cursor-1 < 0) {
                    cursor = answers.length - 1;
                } else {
                    cursor = cursor - 1;
                }
            } while (bubbles[cursor].popped);
        }
    }

    function updateBubbleText() {
        for (let i = 0; i < bubbles.length; i++) {
            if (bubbles[i].popped) {
                bubbles[i].numText.visible = false;
            } else {
                bubbles[i].numText.visible = true;
            }

            if (cursor == i) {
                bubbles[i].numText.fill = Globals.colors.selected;
            } else {
                bubbles[i].numText.fill = Globals.colors.unselected;
            }
        }
    }
};

