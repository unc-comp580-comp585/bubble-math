var w = 800;
var h = 600;

var game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.CANVAS, "game");

game.state.add("bootMainMenu", bootGame);
game.state.add("loadMainMenu", loadMenu);
game.state.add("startMainMenu", mainMenu);
game.state.add("Options", optionsMenu);
game.state.add("Game1", gamemode1);
game.state.add("Game2", gamemode2);
game.state.add("Tutorial", tutorial)

game.state.start("bootMainMenu");
