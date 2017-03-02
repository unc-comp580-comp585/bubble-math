function Bubble(game, cx, cy, r, num) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.r = r;

    this.num = num;

    this.sprite = game.add.sprite(cx, cy, Globals.handles.bubble_popping);
    this.sprite.frame = 0;
    this.sprite.anchor.setTo(0.5, 0.5);
    Graphics.scaleSprite(game, Globals.handles.bubble, this.sprite, 2*r, 2*r);

    // Set font settings
    //      TODO: Set size based on radius
    //      TODO: Figure out why it's not vertically aligned
    this.numText = game.add.text(cx, cy, num.toString(), {
        font: "bold 32px Courier",
        fill: Globals.colors.unselected,
        boundsAlignH: "center",
        boundsAlignV: "middle",
    });
    this.numText.anchor.setTo(0.5, 0.5);

    this.popped = false;

    // Add popping animation
    this.sprite.animations.add(Globals.animations.pop);
}

Bubble.prototype.drawAt = function(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.numText.x = x;
    this.numText.y = y;
}
