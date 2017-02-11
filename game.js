window.onload = function() {
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    //Global Defines
    var gamepad;
    var gamepad_enabled;
    var leftjs_dead_zone = 0.1;
    var difficulty = 2;

    //BS1 Defines
    var cursor;
    var wheel_map = {};


    function preload()
    {
        for(var coeff = 0; coeff < 3; coeff ++){
            wheel_map[''+coeff] = [];
            var addition = Math.PI / (2 * (2 * (coeff + 1)));
            for(var i = 0; i < 2 * Math.PI; i += addition) {
                var convert = i * (180 / Math.PI);
                wheel_map[''+coeff].push(convert);
            }
        }
    }

    function create()
    {
        game.stage.backgroundColor = '#7BAFD4';
        
        game.input.gamepad.start();

        gamepad = game.input.gamepad.pad1;

    }

    function update()
    {
        gamepad_enabled = game.input.gamepad.supported && game.input.gamepad.active && gamepad.connected;
        if(gamepad_enabled){
            process_gamepad_controls();
        }
        else{
            process_keyboard_controls();
        }
        if(cursor != -1)
            console.log('' + cursor + ' -> ' + wheel_map[''+difficulty][cursor]);  
        else
            console.log('cursor netural');
    }

    function process_gamepad_controls()
    {
        process_left_joystick();
        //process_right_joystick();
    }

    function process_left_joystick()
    {
        cursor = -1;
        var controller_moved_x = Math.abs(gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) > leftjs_dead_zone;
        var controller_moved_y = Math.abs(gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)) > leftjs_dead_zone;
        if(controller_moved_x || controller_moved_y)
        {
            var x = gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
            var y = -gamepad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
            var tmp  = Math.atan2(y, x);
            if(y < 0)
            {
                tmp += 2 * Math.PI;
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)

            }
            else
            {
                cursor = tmp;
                cursor *= 360 / (2 * Math.PI)

            }
            cursor = Math.abs(cursor);
            map_cursor_to_wheel(cursor);
        }
    }

    function map_cursor_to_wheel(cursor_val)
    {
        var wheel = wheel_map[''+difficulty]
        for(var i = 0; i < wheel.length; i ++)
        {
            if(cursor_val <= wheel[i]){
                cursor = i;
                return;
            }
        }
        cursor = 0;
        return;
    }

    function process_right_joystick()
    {

    }

    function process_keyboard_controls()
    {
             
    }

    function init_input()
    {

    }
    
};

