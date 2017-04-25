function Bubble(game, cx, cy, r, num, is_inner) {
    this.game = game;

    this.cx = cx;
    this.cy = cy;

    this.r = r;

    this.num = num;

    this.sprite = game.add.sprite(cx, cy, 'bubble-pop');
    this.sprite.frame = 0;
    this.sprite.anchor.setTo(0.5, 0.5);

    let new_w = 2*r + 100;
    let new_h = 2*r + 90;
    Graphics.scaleSprite(game, Globals.handles.bubble, this.sprite, new_w, new_h);
    this.original_w = new_w;
    this.original_h = new_h;

    let text = num.toString();
    let fontsize = 26;

    let fractions_enabled = (Globals.GradeSel % 2 == 1);

    if (Globals.GameMode == 2 && fractions_enabled) {
        fontsize = 18;
        let len = text.length;
        let slash = text.indexOf("/");
        let numer = text.substring(1, slash);
        if (is_inner) {
            let denom = text.substring(slash+1, len-2);
            text = numer + "\n—\n" + denom + "   ";
        } else {
            let denom = text.substring(slash+1, len-1);
            text = numer + "\n—\n" + denom;
        }
    }

    this.numText = game.add.text(cx, cy, text, {
        font: "bold " + fontsize + "px Comic Sans MS",
        fill: Globals.colors.unselected,
        boundsAlignH: "center",
        boundsAlignV: "middle",
        stroke: 'black',
        strokeThickness: 4,
    });
    this.numText.anchor.setTo(0.5, 0.5);
    this.numText.lineSpacing = -20;

    if (Globals.GameMode == 2 && fractions_enabled && is_inner) {
        text = num.toString();
        let op = text[text.length-1];
        if (op == "/") {
            op = "÷";
        } else if (op == "*") {
            op = "×";
        }
        let op_fontsize = 30;
        this.opText = game.add.text(cx+10, cy, op, {
            font: "bold " + op_fontsize + "px Comic Sans MS",
            fill: Globals.colors.unselected,
            boundsAlignH: "center",
            boundsAlignV: "middle",
            stroke: 'black',
            strokeThickness: 4,
        });
        this.opText.anchor.setTo(0.5, 0.5);
    }

    this.popped = false;

    // Add popping animation
    this.sprite.animations.add('bubble-pop');

    this.chosen = false;

    this.selected = false;
}

Bubble.prototype.enlarge = function() {
    let new_w = this.original_w + 15;
    let new_h = this.original_w + 5;
    Graphics.scaleSprite(this.game, Globals.handles.bubble, this.sprite, new_w, new_h);
}

Bubble.prototype.shrink = function() {
    Graphics.scaleSprite(this.game, Globals.handles.bubble, this.sprite, this.original_w, this.original_h);
}
