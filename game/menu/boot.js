var bootGame = function(game) {

};

bootGame.prototype = {
    preload: function() {


    },

    create: function() {
        this.game.state.start("loadMainMenu");
    }
};