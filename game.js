window.onload = function() {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    /*********************************************/
    // Difficulty Sections

    // Difficulty of Game [0-2]
    var difficulty = 0;

    // Grade in School [1-4]
    var grade = 1;

    // Mode [0-1]
    var game_mode = 1;

    /*********************************************/
    // Game Mechanics Variables
    var cursor;

    // Mapping of cursors -> answers
    var wheel_map;

    // Question -> answer
    var equation_map;

    // Questions that have been answered
    var answered_questions;

    // Index of current question
    var question_index;

    // Array of questions
    var questions;

    // Array of answers
    var answers;

    // Operations allowed
    var ops = [];

    // Numbers we generate from
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Fractions enabled
    var fractions;

    var selections;

    /*********************************************/
    //Input Related Things

    // Keyboard fallbacks
    var Q;
    var E;
    var Space;
    var R;
    var X;

    var A;
    var S;
    var T;

    // Up Ring Modifier
    var Shift;

    // Down ring modifier
    var Ctrl;

    // Ring modifiers
    var down_level = false;
    var up_level = false;

    // Whether the game is over or not to avoid looping win sound over and over again
    var won;

    /*********************************************/
    // Scorekeeping Information

    // Global score
    var score;

    // 'Streak' multiplier
    var score_multiplier;

    // How many bubbles were considered before selecting answers
    var score_selections;

    /*********************************************/
    // GRAPHICS RELATED VARIABLES

    // Array of bubble objects
    var bubbles;

    // Wand object
    var wand;

    // Distances of bubbles from center (indexed first by game
    // mode then by difficulty)
    var radii = [
        [ 70, 100, 130],
        [140, 170, 200],
    ];

    // Wand dimensions (indexed by difficulty)
    var wand_dims = [
        { w: 40, h: 70  },
        { w: 60, h: 120 },
        { w: 80, h: 160 },
    ];

    // Text to display current question
    var question_text;

    /*********************************************/
    // Audio / Speech to Text / Text to Speech Stuff

    // Audio contexts
    var game_sounds = {};

    // Enable/Disable speech or sounds
    var dictation = true;
    var soundfx = true;

    // Speech recognition object
    var recognition;

    function preload() {
        game.load.image(Globals.handles.bubble, 'assets/images/bubble.png');
        game.load.image(Globals.handles.background, 'assets/images/background.png');
        game.load.image(Globals.handles.wand, 'assets/images/wand.png');

        score = 0;

        game_sounds = {};

        Sound.loadSounds(game, game_sounds);

        if (!('speechSynthesis' in window)) {
            dictation = false;
        }
    }

    function create() {
        initGame();

        game.input.gamepad.start();

        Sound.addSounds(game, game_sounds);
        recognition = Sound.initRecognition(recognition);
        console.dir(recognition);

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

        X = game.input.keyboard.addKey(Phaser.Keyboard.X);
        X.onDown.add(onX, this);

        Shift = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        Shift.onDown.add(function() { up_level = true; }, this);
        Shift.onUp.add(function() { up_level = false; } , this);

        Ctrl = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        Ctrl.onDown.add(function() { down_level = true; }, this);
        Ctrl.onUp.add(function() { down_level = false; } , this);

        Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Space.onDown.add(onSpace, this);

        console.log("Questions: " + questions);
        if (game_mode === 0)
            console.log("Answers:   " + answers);
        else if (game_mode === 1) {
            console.log("Answers [0]: " + answers[0]);
            console.log("Answers [1]: " + answers[1]);
        }
        console.debug("Bubbles: %o", bubbles);
        console.debug("Wheel: %o", wheel_map);
        console.debug("Sounds: %o", game_sounds);
    }

    function initGame() {
        Graphics.drawBackground(game);

        question_text = game.add.text(game.world.centerX, 50, "", {
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

        ops = ['+', '-'];
        if (grade >= 3) {
            ops.push('*');
            ops.push('/');
        }
        if (grade % 2 == 0) {
            fractions = true;
        }

        generate_wheel_map();

        generate_equations();

        cursor = 0;

        score = 0;

        score_selections = 0;

        score_multiplier = 1;

        fractions = false;

        selections = ['', ''];

        question_text.setText(questions[question_index].trim());

        //TODO: Federico write graphics logic for this gamemode
        if (game_mode === 0) {
            bubbles = Graphics.drawWheelMap(game, wheel_map[difficulty], answers, [radii[0][difficulty], radii[1][difficulty]], game_mode);
            bubbles[cursor].numText.fill = Globals.colors.selected;
        } else if (game_mode === 1) {
            bubbles = Graphics.drawWheelMap(game, wheel_map[difficulty], answers, [radii[0][difficulty], radii[1][difficulty]], game_mode);
        }

        let wand_w = wand_dims[difficulty].w;
        let wand_h = wand_dims[difficulty].h;
        let angle = wheel_map[difficulty][cursor];
        wand = new Wand(game, game.world.centerX, game.world.centerY, wand_w, wand_h, angle);
    }

    // Display current question/answer
    function onR() {
        console.log("Question : "  + questions[question_index]);
        if (game_mode === 0) {
            console.log("Answers:   " + answers);
            console.log("Current Answer: " + answers[cursor]);
        } else if (game_mode === 1) {
            console.log("Inner Ring: " + answers[0][cursor]);
            console.log("Outer Ring: " + answers[1][cursor]);
            console.log("Selection: " + selections);
            console.log("Answers [0]: " + answers[0]);
            console.log("Answers [1]: " + answers[1]);
        }
        console.log("Questions: " + questions);
        console.debug("Bubbles: %o", bubbles);
        console.debug("Wheel: %o", wheel_map);
        console.debug("Sounds: %o", game_sounds);
        console.log("Modifiers: Up Ring["+up_level+"] Down Ring["+down_level+"]");
        console.log("Score: " + score);
        console.log("Score Multiplier: " + score_multiplier);
        console.log("Number of Selected Circles: " + score_selections);
        if (dictation) {
            Sound.readEquation("The question is: " + questions[question_index]);
            Sound.readEquation("Your bubble is: " + answers[cursor]);
        }
    }

    // Rotate cursor CW
    function onQ() {
        decrease_cursor();

        //TODO: Federico write graphics logic for this gamemode
        if (game_mode === 0) {
            updateBubbleTextColors();
        } else if (game_mode === 1) {

        }
        wand.rotateTo(wheel_map[difficulty][cursor]);

        if (dictation) {
            Sound.readEquation(answers[cursor]);
        }
        if (soundfx) {
            Sound.play(game_sounds,'bubbles');
        }
    }

    // Rotate cursor CCW
    function onE() {
        increase_cursor();

        //TODO: Federico write graphics logic for this gamemode
        if (game_mode === 0) {
            updateBubbleTextColors();
        } else if (game_mode === 1) {

        }
        wand.rotateTo(wheel_map[difficulty][cursor]);

        if (dictation && !won) {
            Sound.readEquation(answers[cursor]);
        }
        if (soundfx && !won) {
            Sound.play(game_sounds,'bubbles');
        }
    }

    // Starts speech recognition
    function onT() {
        console.log(recognition);
        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var number = event.results[last][0].transcript;
            console.log('Result received: ' + number + '.');
            console.log('Confidence: ' + event.results[0][0].confidence);
            if (Number.isInteger(parseInt(number))) {
                lock_in_answer(number);
            } else {
                lock_in_answer(Globals.small[number]);
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
        recognition.start();
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
            if (dictation && !won) {
                Sound.dictate('victory');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds,'win');
            }
            won = true;
            return;
        }

        if (Globals.gamepadEnabled(game)) {
            process_gamepad_controls();
        }
    }

    function process_gamepad_controls() {
        process_left_joystick();
        process_gamepad_buttons();
    }

    function process_gamepad_buttons() {
        if (Globals.gamepad.justPressed(Phaser.Gamepad.XBOX360_A) && cursor != -1) {
            lock_in_answer();
        }
    }

    function lock_in_answer(spoken_answer) {
        if (game_mode === 0) {
            lock_in_answer_gm1(spoken_answer);
        } else if (game_mode === 1) {
            lock_in_answer_gm2(spoken_answer);
        }
    }

    function lock_in_answer_gm2(spoken_answer) {
        let first_index = up_level ? 0 : 1;
        let good = eval("".concat(...selections)) === Number(questions[question_index]) && !(("".concat(...selections)) in answered_questions);
        if (good) {
            score += ((10000) * score_multiplier) * (Math.max(1, 20-score_selections));
            score_multiplier += 1;
            score_selections = 0;

            //TODO: Federico write graphics logic for this gamemode
            // bubbles[cursor].popped = true;
            answered_questions["".concat(...selections)] = true;


            //TODO: Federico write graphics logic for this gamemode
            //updateBubbleTextColors();
            question_index += 1;

            if (question_index < questions.length) {
                question_text.setText(questions[question_index].trim());
            }
            if (dictation && !won) {
                Sound.dictate('correct');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds,'pop');
            }
            console.log("Correct!");
        } else if (("".concat(...selections)) in answered_questions) {
            //is this possible now?
            console.log("answer: " + "".concat(...selections) + " @ cursor: " + cursor + " already used");
            // TODO: Add soundfx for this
        } else {
            if (dictation && !won) {
                Sound.dictate('incorrect');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds, 'wrong');
            }
        }
    }

    function onX() {
        let first_index = up_level ? 1 : 0;
        selections[first_index] = answers[first_index][cursor]
    }

    function lock_in_answer_gm1(spoken_answer) {
        let spoken  = spoken_answer != undefined;
        let good = spoken && eval(questions[question_index]) == spoken_answer;
        good = good || (!spoken && eval(questions[question_index]) === answers[cursor] && !(cursor in answered_questions));

        if (good) {
            score += ((10000) * score_multiplier) * (Math.max(1, 20-score_selections));
            score_multiplier += 1;
            score_selections = 0;
            if (spoken) {
                for(var i = 0; i < bubbles.length; i++) {
                    if (bubbles[i].num == eval(questions[question_index]) && bubbles[i].popped == false) {
                        bubbles[i].popped = true;
                        answered_questions[i] = true;
                        break;
                    }
                }
            } else {
                //TODO: Federico write graphics logic for this gamemode
                bubbles[cursor].popped = true;
                answered_questions[cursor] = true;
            }

            //TODO: Federico write graphics logic for this gamemode
            updateBubbleTextColors();
            question_index += 1;

            if (question_index < questions.length) {
                question_text.setText(questions[question_index].trim());
            }
            if (dictation && !won) {
                Sound.dictate('correct');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds,'pop');
            }
            console.log("Correct!");
        } else if (cursor in answered_questions) {
            //is this possible now?
            console.log("answer: " + answers[cursor] + " @ cursor: " + cursor + " already used");
            // TODO: Add soundfx for this
        } else {
            if (dictation && !won) {
                Sound.dictate('incorrect');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds, 'wrong');
            }
        }
    }

    function process_left_joystick() {
        cursor = -1;
        var controller_moved_x = Math.abs(Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) > Globals.leftJSDeadZone;
        var controller_moved_y = Math.abs(GLobals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)) > Globals.leftJSDeadZone;
        if (controller_moved_x || controller_moved_y) {
            var x =  Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            var y = -Globals.gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
            var tmp  = Math.atan2(y, x);
            if (y < 0) {
                tmp += 2 * Math.PI;
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)
            } else {
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)
            }
            cursor = Math.abs(cursor);
            map_cursor_to_wheel(cursor);
        }
    }

    function map_cursor_to_wheel(cursor_val) {
        var wheel = wheel_map[difficulty]
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
            wheel_map[coeff] = [];
            var addition = Math.PI / ((2 * (coeff + 1)));
            for (var i = 0; i < 2 * Math.PI; i += addition) {
                var convert = i * (180 / Math.PI);
                wheel_map[coeff].push(convert);
            }
        }
    }

    function generate_equations() {
        if (game_mode === 0) {
            generate_gm1_equations();
        } else if (game_mode === 1) {
            generate_gm2_equations();
        }
    }

    function generate_gm2_equations() {
        let length = wheel_map[difficulty].length;
        let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        questions = [];
        answers = [[], []];

        let j = 0;
        while (j < length) {
            let str = '';
            let numerator_1 = nums[game.rnd.integerInRange(0, nums.length - 1)];
            str += numerator_1 + ' ';
            let denominator_1 = 1;
            if (fractions) {
                denominator_1 =  nums[game.rnd.integerInRange(0, nums.length - 1)];
                str +=  '/ ' + denominator_1 + ' ';
            }
            let op = ops[game.rnd.integerInRange(0, ops.length - 1)];
            str += op + ' ';
            let lower_bound = nums.length - 1;
            if (op === '-') {
                lower_bound = numerator_1;
            }
            let numerator_2 = nums[game.rnd.integerInRange(0, lower_bound)];
            str += numerator_2 + ' ';
            let denominator_2 = 1;
            if (fractions) {
                denominator_2 = nums[game.rnd.integerInRange(0, nums.length - 1)];
                str += '/ ' + denominator_2;
            }
            let result = eval(str);

            if (numerator_2 === 0 && op === '/') {
                continue;
            }
            if ((numerator_2 / denominator_2) > (numerator_1 / denominator_2) && op === '/') {
                continue;
            }
            if (!Number.isInteger(result)) {
                continue;
            }
            if (questions.indexOf(str) !== -1) {
                continue;
            } else {
                j++;
                questions.push(''+result);
                if (fractions) {
                    answers[0].push(''+numerator_1 + ' / ' + denominator_1 + ' ' + op);
                    answers[1].push(''+numerator_2 + ' / ' + denominator_2);
                } else {
                    answers[0].push(numerator_1 + op);
                    answers[1].push(''+numerator_2);
                }
            }
        }
        shuffle_questions();
    }

    function generate_gm1_equations() {
        let length = wheel_map[difficulty].length;

        questions = [];
        answers = [];

        let j = 0;
        while (j < length) {
            let str = '';
            let numerator_1 = nums[game.rnd.integerInRange(0, nums.length - 1)];
            str += numerator_1 + ' ';
            let denominator_1 = 1;
            if (fractions) {
                denominator_1 =  nums[game.rnd.integerInRange(0, nums.length - 1)];
                str +=  '/ ' + (''+denominator_1) + ' ';
            }
            let op = ops[game.rnd.integerInRange(0, ops.length - 1)];
            str += op + ' ';
            let lower_bound = nums.length - 1;
            if (op === '-') {
                lower_bound = numerator_1;
            }
            let numerator_2 = nums[game.rnd.integerInRange(0, lower_bound)];
            str += numerator_2 + ' ';
            let denominator_2 = 1;
            if (fractions) {
                denominator_2 = nums[game.rnd.integerInRange(0, nums.length - 1)];
                str += '/ ' + denominator_2;
            }
            let result = eval(str);

            if (numerator_2 === 0 && op === '/') {
                continue;
            }
            if ((numerator_2 / denominator_2) > (numerator_1 / denominator_2) && op === '/') {
                continue;
            }
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
        shuffle_questions();

    }

    function shuffle_questions() {
        for (var i = questions.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = questions[i];
            questions[i] = questions[j];
            questions[j] = temp;
        }
    }

    function increase_cursor() {
        if (!won) {
            score_selections += 1;

            //TODO: Federico write graphics logic for this gamemode
            if (game_mode === 0) {
                do {
                    cursor = (cursor + 1) % questions.length;
                } while (bubbles[cursor].popped);

            } else if (game_mode === 1) {

            }
        }
    }

    function decrease_cursor() {
        if (!won) {
            score_selections += 1;

            //TODO: Federico write graphics logic for this gamemode
            if (game_mode === 0) {
                do {
                    if (cursor-1 < 0) {
                        cursor = questions.length - 1;
                    } else {
                        cursor = cursor - 1;
                    }
                } while (bubbles[cursor].popped);

            } else if (game_mode === 1) {

            }
        }
    }

    function updateBubbleTextColors() {
        if (game_mode == 0) {
            for (let i = 0; i < bubbles.length; i++) {
                if (bubbles[i].popped) {
                    bubbles[i].numText.fill = Globals.colors.popped;
                } else {
                    bubbles[i].numText.fill = Globals.colors.unselected;
                }
            }
            if (bubbles[cursor].popped) {
                bubbles[cursor].numText.fill = Globals.colors.popped;
            } else {
                bubbles[cursor].numText.fill = Globals.colors.selected;
            }
        }
    }
};
