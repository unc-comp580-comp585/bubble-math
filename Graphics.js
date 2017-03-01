var Graphics = {};

// Render background image
Graphics.drawBackground = function(game) {
    game.add.tileSprite(0, 0, game.world.width, game.world.height, Globals.handles.background);
};

// Draw bubbles in wheel pattern. Since sprites that are created
// are also automatically rendered, this function both creates
// the Bubble objects and renders them.
Graphics.drawWheelMap = function(game, wheel_map, answers, difficulty) {
    let bubbles = [];
    let angles = wheel_map[''+difficulty];
    for (let i = 0; i < angles.length; i++) {
        let angle = angles[i] * Math.PI/180.0;

        let dist = (difficulty+1) * 50;

        let cx = game.world.centerX + dist*Math.sin(angle);
        let cy = game.world.centerY + dist*Math.cos(angle);

        let num = answers[i];

        bubbles.push(new Bubble(game, cx, cy, 30, num));
    }
    return bubbles;
};

// Scale sprite to new dimensions w, h
Graphics.scaleSprite = function(game, handle, sprite, w, h) {
    // Get original image dimensions
    let imgprops = game.cache.getImage(handle);
    let imgw = imgprops.width;
    let imgh = imgprops.height;

    // Scale to desired dimensions
    let sx = w / imgw;
    let sy = h / imgh;

    // Apply sprite scaling
    sprite.scale.setTo(sx, sy);
}
