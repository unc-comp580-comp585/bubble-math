/*
 * Defines the node packages to 'browserify' for use in a <script> tag
 * 
 */
var wn = require('written-number');
var gt = require('google-translate');

// Functions of window object for global use
window.writtenNumber = wn;
window.googleTranslate = gt.translate;