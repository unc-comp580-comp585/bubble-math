var Graphics = {};

// Render background image
Graphics.drawBackground = function(game) {
    game.add.tileSprite(0, 0, game.world.width, game.world.height, Globals.handles.background);
};

// Draw bubbles in wheel pattern. Since sprites that are created
// are also automatically rendered, this function both creates
// the Bubble objects and renders them.
Graphics.drawWheelMap = function(game, angles, answers, radii, game_mode) {
    let bubbles = (game_mode === 0 ? [] :
                   game_mode === 1 ? [[], []] :
                   undefined);

    for (let i = 0; i < angles.length; i++) {
        let angle = angles[i] * Math.PI/180.0;

        if (game_mode === 0) {
            let cx = game.world.centerX + radii[0]*Math.sin(angle);
            let cy = game.world.centerY - radii[0]*Math.cos(angle);

            let num = answers[i];

            bubbles.push(new Bubble(game, cx, cy, 30, num));
        } else if (game_mode === 1) {
            let cx_inner = game.world.centerX + radii[0]*Math.sin(angle);
            let cy_inner = game.world.centerY - radii[0]*Math.cos(angle);

            let cx_outer = game.world.centerX + radii[1]*Math.sin(angle);
            let cy_outer = game.world.centerY - radii[1]*Math.cos(angle);

            let inner_answer = answers[0][i];
            let outer_answer = answers[1][i];

            bubbles[0].push(new Bubble(game, cx_inner, cy_inner, 30, inner_answer));
            bubbles[1].push(new Bubble(game, cx_outer, cy_outer, 30, outer_answer));
        }
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
