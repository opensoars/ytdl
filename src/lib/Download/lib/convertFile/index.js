"use strict";

const spawn = require('child_process').spawn;

module.exports = function convertFile(args) {
  console.log(args);
  return new Promise((resolve, reject) => {
    const new_file_name = args.temp_dir + '/' + args.file_name + '.mp3';
    const ffmpeg = spawn('ffmpeg', [
      '-i', args.temp_file_loc,
      '-f', 'mp3', new_file_name
    ]);

    let total_duration_secs;

    ffmpeg.on('error', (err) => reject(err));

    ffmpeg.stderr.on('data', data => {
      if (data.indexOf('Overwrite ? [y/N]') !== -1) ffmpeg.stdin.write('y\n');
      else if (data.indexOf('Duration: ') !== -1) {
        let duration_matches = args.duration_re.exec(data.toString());
        if (duration_matches[1]) {
          total_duration_secs = duration_matches[1];
        }
        else {
          console.log(
            'no duration_matches, could not extract total file time in seconds'
          );
        }
      }
      else if (data.indexOf('time=') !== -1) {
        let time_matches = args.time_re.exec(data.toString());
        if (time_matches[1]) {
          this.emit('conversion-progress', {
            total: total_duration_secs,
            current: time_matches[1]
          });
        }
        else {
          console.log(
            'no time_matches[1], could not extract current conversion time'
          );
        }
      }
    });

    ffmpeg.on('close', (code) => {
      if (code === 0)
        resolve(new_file_name);
      else
        reject('ffmpeg exited with code ' + code);
    });
  });
};