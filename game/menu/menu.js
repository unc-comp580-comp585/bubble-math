var mainMenu = function(game) {

};

mainMenu.prototype = {
    preload: function() {


    },

    drawMenu: function() {
        this.game.add.text(300, 80, 'Bubble Math!', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(300, 350, 'Tutorial', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(300, 400, 'Play Gamemode 1', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(300, 450, 'Play Gamemode 2', {font : '30px Arial', fill: '#ffffff'});
        this.game.add.text(300, 500, 'Options', {font : '30px Arial', fill: '#ffffff'});
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
        console.log("next state sel - ", this.selection);
        switch(this.selection) {
            case 0: this.game.state.start("Tutorial"); break;
            case 1: this.game.state.start("Game1"); break;
            case 2: this.game.state.start("Game2"); break;
            case 3: this.game.state.start("Options"); break;
        }
    },


    update: function() {
        this.drawMenu();
        switch(this.selection) {
            case 0: this.game.add.text(300, 350, 'Tutorial', {font : '30px Arial', fill: '#00ff00'}); break;
            case 1: this.game.add.text(300, 400, 'Play Gamemode 1', {font : '30px Arial', fill: '#00ff00'}); break;
            case 2: this.game.add.text(300, 450, 'Play Gamemode 2', {font : '30px Arial', fill: '#00ff00'}); break;
            case 3: this.game.add.text(300, 500, 'Options', {font : '30px Arial', fill: '#00ff00'}); break;
        }


    },
    
    selection: 0,
};