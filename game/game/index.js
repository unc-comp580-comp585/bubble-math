var w = 1000;
var h = 650;

var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.CANVAS, "game");

game.state.add("bootMainMenu", bootGame);
game.state.add("loadMainMenu", loadMenu);
game.state.add("startMainMenu", mainMenu);
game.state.add("Options", optionsMenu);
game.state.add("Game1", gamemode1);
game.state.add("Game2", gamemode2);
game.state.add("Tutorial", tutorial)

game.state.start("bootMainMenu");

// Generates iterator to specified range
function* range(begin, end, interval = 1){
    for (let i = begin; i < end; i += interval) {
        yield i;
    }
}

// Clears timeouts/intervals and 'interrupts' waiting async functions
function clearTimeouts(){
    for(i of range(0, 10000)){
      window.clearInterval(i);
      window.clearTimeout(i);
    }
}
