var bootGame = function(game) {

};

bootGame.prototype = {
    preload: function() {


    },

    create: function() {
        console.info(Globals.DictationEnabled);
        this.game.state.start("loadMainMenu");
    }
};