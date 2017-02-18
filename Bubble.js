function Bubble(game, cx, cy, r, num) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.r = r;

    this.num = num;

    // Get image dimensions
    var imgprops = game.cache.getImage(Globals.handles.bubble);
    var w = imgprops.width;
    var h = imgprops.height;

    // Scale to desired radius
    var sx = 2*r / w;
    var sy = 2*r / h;

    // Apply sprite scaling
    this.sprite = game.add.sprite(cx, cy, Globals.handles.bubble);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(sx, sy);

    // Set font settings
    //      TODO: Set size based on radius
    //      TODO: Figure out why it's not vertically aligned
    this.numText = game.add.text(cx, cy, num.toString(), {
        font: "bold 32px Courier",
        fill: "#ffffff",
        boundsAlignH: "center",
        boundsAlignV: "middle",
    });
    this.numText.anchor.setTo(0.5, 0.5);
}

Bubble.prototype.drawAt = function(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.numText.x = x;
    this.numText.y = y;
}
