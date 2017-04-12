var loadMenu = function(game) {

};

loadMenu.prototype = {
    preload: function() {
        this.game.load.image(Globals.handles.bubble, 'assets/images/bubble.png');
        this.game.load.image(Globals.handles.bunny, 'assets/images/bunny.png');
        this.game.load.image(Globals.handles.background, 'assets/images/background.png');
        this.game.load.image(Globals.handles.wand, 'assets/images/wand.png');

        this.game.load.spritesheet(Globals.handles.bubble_popping, 'assets/sheets/bubble-popping.png', 256, 256);
        this.game.load.spritesheet(Globals.handles.bunny_jumping, 'assets/sheets/bunny-jump.png', 256, 256);

        //Sound.loadSounds(Globals.game, Globals.game_sounds);

        if (!('speechSynthesis' in window)) {
            Globals.dictation = false;
        }
    },

    create: function() {
        this.game.state.start("startMainMenu");
    },

};