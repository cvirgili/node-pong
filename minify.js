var compressor = require('node-minify');

compressor.minify({
    compressor: 'gcc',
    input: __dirname + '/contents/javascript/pong.js',
    output: __dirname + '/contents/javascript/pong.min.js',
    callback: function(err, min) {
        if (err)
            console.log(err);
    }
});
compressor.minify({
    compressor: 'gcc',
    input: __dirname + '/contents/javascript/player.js',
    output: __dirname + '/contents/javascript/player.min.js',
    callback: function(err, min) {
        if (err)
            console.log(err);
    }
});
compressor.minify({
    compressor: 'gcc',
    input: __dirname + '/contents/javascript/fb.login.js',
    output: __dirname + '/contents/javascript/fb.login.min.js',
    callback: function(err, min) {
        if (err)
            console.log(err);
    }
});