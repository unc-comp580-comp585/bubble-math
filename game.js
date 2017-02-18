window.onload = function() {
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    // Global Defines
    var gamepad;
    var gamepad_enabled;
    var leftjs_dead_zone = 0.1;

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

    function preload() {
        wheel_map = {};
        equation_map = {};
        answered_questions = {};
        question_index = 0;
        for (var coeff = 0; coeff < 3; coeff ++) {
            wheel_map[''+coeff] = [];
            var addition = Math.PI / ((2 * (coeff + 1)));
            for (var i = 0; i < 2 * Math.PI; i += addition) {
                var convert = i * (180 / Math.PI);
                wheel_map[''+coeff].push(convert);
            }
        }
        generate_equations();
    }

    function create() {
        cursor = 0;
        Graphics.drawBackground(game);
        
        game.input.gamepad.start();

        gamepad = game.input.gamepad.pad1;

        Q = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Q.onDown.add(onQ, this);

        E = game.input.keyboard.addKey(Phaser.Keyboard.E);
        E.onDown.add(onE, this);

        R = game.input.keyboard.addKey(Phaser.Keyboard.R);
        R.onDown.add(onR, this);

        Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Space.onDown.add(onSpace, this);
    }

    function onR() {
        console.log("Question : "  + questions[question_index]);
        console.log("Current Answer: " + answers[cursor]);
    }


    function onQ() {
        console.log("Rotating Cursor CCW - (Cursor, Val): (" + cursor + ", " + answers[cursor] + ")");
        if (cursor - 1 < 0) {
            cursor = answers.length - 1;
        } else  {
            cursor = cursor - 1;
        }
        console.log("Rotated Cursor CCW - NEW (Cursor, Val): (" + cursor + ", " + answers[cursor] + ")");
    }

    function onE() {
        console.log("Rotating Cursor CCW - (Cursor, Val): (" + cursor + ", " + answers[cursor] + ")");
        cursor = (cursor + 1) % answers.length;    
        console.log("Rotated Cursor CCW - NEW  (Cursor, Val): (" + cursor + ", " + answers[cursor] + ")");
    }

    function onSpace() {
        lock_in_answer();
    }

    function update() {
        if (question_index  === questions.length) {
            alert('You Win!');
            preload();       
            return;
        }
        gamepad_enabled = game.input.gamepad.supported && game.input.gamepad.active && gamepad.connected;
        if (gamepad_enabled) {
            process_gamepad_controls();
        }
    }

    function process_gamepad_controls() {
        process_left_joystick();
        process_gamepad_buttons();
    }

    function process_gamepad_buttons() {
        if (gamepad.justPressed(Phaser.Gamepad.XBOX360_A) && cursor != -1) {
            lock_in_answer();
        }
    }

    function lock_in_answer() {
        console.log('question: ' + questions[question_index]);
        console.log('locked in answer: ' + answers[cursor]);
        if (eval(questions[question_index]) === answers[cursor] && !(cursor in answered_questions)) {
            answered_questions[cursor] = true;
            //cannot use this cursor index for answer again.
            question_index += 1
            console.log("Correct!");;
        } else if(cursor in answered_questions) {
            console.log("answer: " + answers[cursor] + " @ cursor: " + cursor + " already used");
        }
    }

    function process_left_joystick() {
        cursor = -1;
        var controller_moved_x = Math.abs(gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) > leftjs_dead_zone;
        var controller_moved_y = Math.abs(gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)) > leftjs_dead_zone;
        if (controller_moved_x || controller_moved_y) {
            var x = gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            var y = -gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
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

    function process_right_joystick() {

    }

    function init_input() {

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
};

