function Wand(game, cx, cy) {
    const wand_dims = [
        { w: 40, h: 70  },
        { w: 60, h: 120 },
        { w: 80, h: 160 },
    ];

    const angles = [
            [0, 90, 180, 270], 
            [0, 45, 90, 135, 180, 225, 270, 315]
            [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
        ];

    this.game = game;
    this.cx = cx;
    this.cy = cy;


    let w = wand_dims[Globals.NumberBubbles].w;
    let h = wand_dims[Globals.NumberBubbles].h;
    let angle = wand_dims[Globals.NumberBubbles].w;

    this.sprite = game.add.sprite(cx, cy, 'wand');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = angle;
    Graphics.scaleSprite(game, 'wand', this.sprite, w, h);
}

Wand.prototype.drawAt = function(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
}

Wand.prototype.rotateTo = function(deg) {
    this.sprite.angle = deg;
}
