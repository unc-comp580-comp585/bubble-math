var Graphics = {};


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
