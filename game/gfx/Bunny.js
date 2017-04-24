function Bunny(game, cx, cy, w, h) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.sprite = game.add.sprite(cx, cy, 'usagi-jump');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.frame = 0;
    this.sprite.animations.add('usagi-jump', [0, 1, 2], 2, true);
    Graphics.scaleSprite(game, 'usagi', this.sprite, w, h);
    this.sprite.play('usagi-jump');
}
