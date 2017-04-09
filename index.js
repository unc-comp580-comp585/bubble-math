$(document).ready(function(){
  $('.ui.modal')
    .modal({
      closable  : false
    })
  ;

  $('.ui.toggle.button').on("click", function(){
    if( $(this).hasClass('soundfx')){
      Globals.soundfx = !Globals.soundfx;
      $(this).toggleClass("green");
    }else if ($(this).hasClass('dictation')){
      Globals.dictation = !Globals.dictation;
      $(this).toggleClass("green");
    }else if ($(this).hasClass('bgm')){
      Sound.toggleBackground();
      $(this).toggleClass("green");
    }else if ($(this).hasClass('mode')){
      Globals.game_mode = (Globals.game_mode + 1) % 2;
      Globals.game_sounds["music"][0].stop()
      Globals.game.state.restart();
      $(this).toggleClass("blue");
      $(this).toggleClass("purple");
    }
  });
});
