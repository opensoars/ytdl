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
      let fmts = yield t.getFmtsFromYtplayerConfig(ytplayer_config);
      let ranked_fmts = yield t.getRankedFmts(fmts);
      let working_fmt = yield t.getWorkingFmt(ranked_fmts, ytplayer_config);

      console.log(working_fmt);

      t.emit('succes', { result: 'result' });
    } catch (err) {
      t.emit('error', err);
    }
  });

  return function start() {
    return ref.apply(this, arguments);
  };
}();