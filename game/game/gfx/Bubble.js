function Bubble(game, cx, cy, r, num) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.r = r;

    this.num = num;

    this.sprite = game.add.sprite(cx, cy, 'bubble-pop');
    this.sprite.frame = 0;
    this.sprite.anchor.setTo(0.5, 0.5);

    let scale = 2*r + 80;
    Graphics.scaleSprite(game, Globals.handles.bubble, this.sprite, scale, scale);

    // Set font settings
    //      TODO: Set size based on radius
    //      TODO: Figure out why it's not vertically aligned
    this.numText = game.add.text(cx, cy, num.toString(), {
        font: "bold 26px Comic Sans MS",
        fill: Globals.colors.unselected,
        boundsAlignH: "center",
        boundsAlignV: "middle",
    });
    this.numText.anchor.setTo(0.5, 0.5);

    this.popped = false;

    // Add popping animation
    this.sprite.animations.add('bubble-pop');
    this.chosen = false;
}

Bubble.prototype.drawAt = function(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    this.numText.x = x;
    this.numText.y = y;
}
