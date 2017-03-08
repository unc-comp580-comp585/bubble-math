function Wand(game, cx, cy, w, h, angle) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.sprite = game.add.sprite(cx, cy, Globals.handles.wand);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.angle = angle;
    Graphics.scaleSprite(game, Globals.handles.wand, this.sprite, w, h);
}

Wand.prototype.drawAt = function(x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
}

Wand.prototype.rotateTo = function(deg) {
    this.sprite.angle = deg;
}
