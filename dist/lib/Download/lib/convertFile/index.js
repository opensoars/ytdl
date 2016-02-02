const spawn = require('child_process').spawn;

module.exports = function convertFile(args) {
  return new Promise(function (resolve, reject) {
    const new_file_name = args.temp_dir + '/' + args.file_name + '.mp3';
    const ffmpeg = spawn('ffmpeg', ['-i', args.temp_file_loc, '-f', 'mp3', new_file_name]);

    ffmpeg.on('error', function (err) {
      return reject(err);
    });

    ffmpeg.stderr.on('data', function (data) {
      if (data.indexOf('Overwrite ? [y/N]') !== -1) ffmpeg.stdin.write('y\n');
    });

    ffmpeg.on('close', function (code) {
      if (code === 0) resolve(new_file_name);else reject('ffmpeg exited with code ' + code);
    });
  });
};