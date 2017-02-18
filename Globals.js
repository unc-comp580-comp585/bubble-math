var Globals = {};

Globals.gamepad = {};
Globals.leftJSDeadZone = 0.1;

Globals.gamepadEnabled = function(game) {
    return game.input.gamepad.supported &&
           game.input.gamepad.active &&
           Globals.gamepad.connected;
};

Globals.handles = {
    bubble: 'bubble',
    background: 'background',
};

Globals.colors = {
    selected: "#ffff00",
    unselected: "#ffffff",
    popped: "000000",
};
