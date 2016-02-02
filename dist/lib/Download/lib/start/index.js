"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

module.exports = function () {
  var ref = _asyncToGenerator(function* () {
    let t = this;
    try {
      let a = yield t.validateArguments(t.args);
      let unvalidated_url = yield t.getUrlFromArguments(a);
      let url = yield t.validateUrl(unvalidated_url);
      let unvalidated_source = yield t.getSourceFromUrl(url);
      let source = yield t.validateSource(unvalidated_source);
      let ytplayer_config = yield t.getYtPlayerConfigFromSource(unvalidated_source, t.regexp.ytplayer_config);
      let video_info = yield t.getVideoInfoFromYtplayerConfig(ytplayer_config);
      let file_safe_video_title = yield t.makeStringFileSafe(video_info.title);
      let fmts = yield t.getFmtsFromYtplayerConfig(ytplayer_config);
      let ranked_fmts = yield t.getRankedFmts(fmts);
      let working_url = yield t.getWorkingUrl({
        ranked_fmts,
        ytplayer_config
      });
      let temp_file_loc = yield t.streamFileToTempDir({
        working_url,
        temp_dir: this.temp_dir,
        file_name: file_safe_video_title
      });

      let converted_temp_file_loc = yield t.convertFile({
        temp_file_loc,
        temp_dir: this.temp_dir,
        file_name: file_safe_video_title
      });

      this.emit('succes', {
        converted_temp_file_loc
      });

      /*    if (working_fmt) {
            t.emit('succes', { result: 'result' });
          }
          else {
            t.emit('error', 'if (working_fmt) not passed');
          }*/

      // console.log(working_fmt);
    } catch (err) {
      t.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();