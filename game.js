window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    // Difficulty of Game [0-2]
    var difficulty = 0;

    // Distances of bubbles from center (indexed by difficulty)
    var radii = [70, 100, 130];

    // Wand dimensions (indexed by difficulty)
    var wand_dims = [
        { w: 40, h: 70  },
        { w: 60, h: 120 },
        { w: 80, h: 160 },
    ];

    // Grade in School [1-4]
    var grade = 1;

    // BS1 Defines
    var cursor;
    var wheel_map;

    // question -> answer
    var equation_map;

    // Questions that have been answered
    var answered_questions;

    // Index of current question
    var question_index;

    var questions;
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

    var bubbles;

    var wand;

    var question_text;

    var won;

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

        Sound.loadSounds(game, game_sounds);

        if (!('speechSynthesis' in window)) {
            dictation = false;
        }

        wheel_map = {};
        equation_map = {};
        answered_questions = {};
        question_index = 0;
        won = false;

        generate_wheel_map();

        generate_equations();
    }

    function create() {
        cursor = 0;

        Graphics.drawBackground(game);

        bubbles = Graphics.drawWheelMap(game, wheel_map[''+difficulty], answers, radii[difficulty]);
        bubbles[cursor].numText.fill = Globals.colors.selected;

        let wand_w = wand_dims[difficulty].w;
        let wand_h = wand_dims[difficulty].h;
        let angle = wheel_map[''+difficulty][cursor];
        wand = new Wand(game, game.world.centerX, game.world.centerY, wand_w, wand_h, angle);

        game.input.gamepad.start();

        question_text = game.add.text(game.world.centerX, 100, "", {
            font: "bold 32px Courier",
            fill: "#ffffff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });

        Sound.addSounds(game, game_sounds);
        recognition = Sound.initRecognition(recognition);
        console.dir(recognition);

        question_text.anchor.setTo(0.5, 0.5);
        question_text.setText(questions[question_index].trim());

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

        Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Space.onDown.add(onSpace, this);

        console.log("Questions: " + questions);
        console.log("Answers:   " + answers);
        console.debug("Bubbles: %o", bubbles);
        console.debug("Wheel: %o", wheel_map);
        console.debug("Sounds: %o", game_sounds);
    }

    // Display current question/answer
    function onR() {
        console.log("Question : "  + questions[question_index]);
        console.log("Current Answer: " + answers[cursor]);
        if(dictation)
        {
            Sound.readEquation("The question is: " + questions[question_index]);
            Sound.readEquation("Your bubble is: " + answers[cursor]);
        }
    }

    // Rotate cursor CW
    function onQ() {
        decrease_cursor();
        updateBubbleTextColors();
        wand.rotateTo(wheel_map[''+difficulty][cursor]);
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
        updateBubbleTextColors();
        wand.rotateTo(wheel_map[''+difficulty][cursor]);
        if (dictation && !won) {
            Sound.readEquation(answers[cursor]);
        }
        if (soundfx && !won) {
            Sound.play(game_sounds,'bubbles');
        }
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
                speak_answer(number);
            } else {
                speak_answer(Globals.small[number]);
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
        lock_in_answer();
    }

    function update() {
        if (question_index  === questions.length) {
            question_text.setText("You win!");
            if(dictation && !won)
            {
                Sound.dictate('victory');
            }
            if(soundfx && !won)
            {
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

    // Evaluate whether a spoken answer is correct
    function speak_answer(spoken_answer){
        console.log('question: ' + questions[question_index]);
        if (eval(questions[question_index]) == spoken_answer) {
            for (var i = 0; i < bubbles.length; i++) {
                if (bubbles[i].num == eval(questions[question_index]) && bubbles[i].popped == false) {
                    bubbles[i].popped = true;
                    answered_questions[i] = true;
                    break;
                }
            }
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
        } else {
            if (dictation && !won) {
                Sound.dictate('incorrect');
            }
            if (soundfx && !won) {
                Sound.play(game_sounds, 'wrong');
            }
        }
    }

    function lock_in_answer() {
        console.log('question: ' + questions[question_index]);
        console.log('locked in answer: ' + answers[cursor]);
        if (eval(questions[question_index]) === answers[cursor] && !(cursor in answered_questions)) {
            bubbles[cursor].popped = true;
            updateBubbleTextColors();

            answered_questions[cursor] = true;
            question_index += 1;
            if (question_index < questions.length) {
                question_text.setText(questions[question_index].trim());
            }
            if(dictation && !won)
            {
                Sound.dictate('correct');
            }
            if(soundfx && !won)
            {
                Sound.play(game_sounds,'pop');
            }
            console.log("Correct!");
        } else if(cursor in answered_questions) {
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
        var wheel = wheel_map[''+difficulty]
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
        let length = wheel_map[''+difficulty].length;
        let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        questions = [];
        answers = [];
        let fractions = false;
        let ops = ['+', '-'];
        if (grade >= 3) {
            ops.push('*');
            ops.push('/');
        }
        if (grade % 2 == 0) {
            fractions = true;
        }

        let j = 0;
        while (j < length) {
            let str = '';
            let numerator_1 = nums[game.rnd.integerInRange(0, nums.length - 1)];
            str += numerator_1 + ' ';
            if (fractions) {
                str += + '/' + nums[game.rnd.integerInRange(0, nums.length - 1)] + ' ';
            }
            let op = ops[game.rnd.integerInRange(0, ops.length - 1)];
            str += op + ' ';
            let lower_bound = nums.length - 1;
            if (op === '-') {
                lower_bound = numerator_1;
            }
            let numerator_2 = nums[game.rnd.integerInRange(0, lower_bound)];
            str += numerator_2 + ' ';
            if (fractions) {
                str += '/' + nums[game.rnd.integerInRange(0, nums.length - 1)];
            }
            let result = eval(str);

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
            do {
                cursor = (cursor + 1) % answers.length;
            } while (bubbles[cursor].popped);
        }
    }

    function decrease_cursor() {
        if (!won) {
            do {
                if (cursor-1 < 0) {
                    cursor = answers.length - 1;
                } else {
                    cursor = cursor - 1;
                }
            } while (bubbles[cursor].popped);
        }
    }

    function updateBubbleTextColors() {
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
};

