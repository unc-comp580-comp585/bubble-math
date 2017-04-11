var Graphics = {};

// Render background image
Graphics.drawBackground = function(game) {
    w = game.world.width;
    h = game.world.height;

    background_sprite = game.add.sprite(w/2, h/2, Globals.handles.background);
    background_sprite.anchor.setTo(0.5, 0.5);
    background_sprite.width = w;
    background_sprite.height = h;
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

        let radius = 15;

        if (game_mode === 0) {
            let cx = game.world.centerX + radii[0]*Math.sin(angle);
            let cy = game.world.centerY - radii[0]*Math.cos(angle);

            let num = answers[i];

            bubbles.push(new Bubble(game, cx, cy, radius, num));
        } else if (game_mode === 1) {
            let cx_inner = game.world.centerX + radii[0]*Math.sin(angle);
            let cy_inner = game.world.centerY - radii[0]*Math.cos(angle);

            let cx_outer = game.world.centerX + radii[1]*Math.sin(angle);
            let cy_outer = game.world.centerY - radii[1]*Math.cos(angle);

            let inner_answer = answers[0][i];
            let outer_answer = answers[1][i];

            bubbles[0].push(new Bubble(game, cx_inner, cy_inner, radius, inner_answer));
            bubbles[1].push(new Bubble(game, cx_outer, cy_outer, radius, outer_answer));
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
