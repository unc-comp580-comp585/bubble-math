var mainMenu = function(game) {

};

mainMenu.prototype = {
    titleText: null,
    tutorialText: null,
    game1Text: null,
    game2Text: null,
    optionsText: null,

    preload: function() {
        this.game.load.image('bg', 'assets/images/background.png');
    },

    drawMenu: function() {
        // Background
        let w = this.game.world.width;
        let h = this.game.world.height;
        let bg = this.game.add.sprite(w/2, h/2, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.width = w;
        bg.height = h;
        bg.alpha = 0.7;

        this.titleText = this.game.add.text(300, 80, 'Bubble Math!', {font : '30px Comic Sans MS', fill: '#ffffff'});
        this.tutorialText = this.game.add.text(300, 300, 'Tutorial', {font : '30px Comic Sans MS', fill: '#ffffff'});
        this.game1Text = this.game.add.text(300, 350, 'Play Gamemode 1', {font : '30px Comic Sans MS', fill: '#ffffff'});
        this.game2Text = this.game.add.text(300, 400, 'Play Gamemode 2', {font : '30px Comic Sans MS', fill: '#ffffff'});
        this.optionsText = this.game.add.text(300, 450, 'Options', {font : '30px Comic Sans MS', fill: '#ffffff'});
    },

    create: function() {
        this.drawMenu();

        this.selection = 0;

        let enter = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        enter.onDown.add(this.nextState, this);

        let up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        up.onDown.add(this.decreaseSel, this);

        let down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        down.onDown.add(this.increaseSel, this);
    },

    increaseSel: function() {
        if(this.selection + 1 > 3)
            this.selection = 0;
        else
            this.selection ++;
    },

    decreaseSel: function() {
        if(this.selection - 1 < 0)
            this.selection = 3;
        else
            this.selection --;
    },

    nextState: function() {
        switch(this.selection) {
            case 0: this.game.state.start("Tutorial"); break;
            case 1: this.game.state.start("Game1"); break;
            case 2: this.game.state.start("Game2"); break;
            case 3: this.game.state.start("Options"); break;
        }
    },

    resetMenu: function() {
            this.tutorialText.addColor("#ffffff", 0);
            this.game1Text.addColor("#ffffff", 0);
            this.game2Text.addColor("#ffffff", 0); 
            this.optionsText.addColor("#ffffff", 0);
    },


    update: function() {
        this.resetMenu();
        switch(this.selection) {
            case 0: this.tutorialText.addColor("#00ff00", 0); break;
            case 1: this.game1Text.addColor("#00ff00", 0); break;
            case 2: this.game2Text.addColor("#00ff00", 0); break;
            case 3: this.optionsText.addColor("#00ff00", 0); break;
        }


    },
    
    selection: 0,
};
