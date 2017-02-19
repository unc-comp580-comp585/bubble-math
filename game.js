window.onload = function() {
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    // Difficulty of Game [0-2]
    var difficulty = 0;

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

    var bubbles;

    var question_text;

    var won;

    function preload() {
        game.load.image(Globals.handles.bubble, 'assets/bubble.png');
        game.load.image(Globals.handles.background, 'assets/background.png');

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

        bubbles = Graphics.drawWheelMap(game, wheel_map, answers, difficulty);
        bubbles[cursor].numText.fill = Globals.colors.selected;

        game.input.gamepad.start();

        question_text = game.add.text(game.world.centerX, 100, "", {
            font: "bold 32px Courier",
            fill: "#ffffff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });
        question_text.anchor.setTo(0.5, 0.5);
        question_text.setText(questions[question_index].trim());

        Globals.gamepad = game.input.gamepad.pad1;

        Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(onQ, this);

        E = game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(onE, this);

        R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        R.onDown.add(onR, this);

        Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Space.onDown.add(onSpace, this);

        console.log("Questions: " + questions);
        console.log("Answers:   " + answers);
        console.debug("Bubbles: %o", bubbles);
        console.debug("Wheel: %o", wheel_map);
    }

    // Display current question/answer
    function onR() {
        console.log("Question : "  + questions[question_index]);
        console.log("Current Answer: " + answers[cursor]);
    }

    // Rotate cursor CW
    function onQ() {
        decrease_cursor();
        updateBubbleTextColors();
    }

    // Rotate cursor CCW
    function onE() {
        increase_cursor();
        updateBubbleTextColors();
    }

    // Submit answer
    function onSpace() {
        lock_in_answer();
    }

    function update() {
        if (question_index  === questions.length) {
            question_text.setText("You win!");
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

            console.log("Correct!");
        } else if(cursor in answered_questions) {
            console.log("answer: " + answers[cursor] + " @ cursor: " + cursor + " already used");
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

