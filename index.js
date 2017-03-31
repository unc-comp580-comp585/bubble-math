$(document).ready(function(){
  $('.ui.modal')
    .modal({
      closable  : false
    })
  ;

  $('.ui.toggle.button').on("click", function(){
    if( $(this).hasClass('soundfx'))
      Globals.soundfx = !Globals.soundfx;
    else
      Globals.dictation = !Globals.dictation;
    $(this).toggleClass("green");  
  });
});
