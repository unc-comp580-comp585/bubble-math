var Graphics = {};

// For now, fill in background with single color
Graphics.drawBackground = function(game) {
    game.add.tileSprite(0, 0, game.world.width, game.world.height, Globals.handles.background);
};
