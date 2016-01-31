"use strict";

module.exports = async function start() {
  let t = this;
  try {
    let a = await t.validateArguments(t.args);
    let unvalidated_url = await t.getUrlFromArguments(a);
    let url = await t.validateUrl(unvalidated_url);
    let unvalidated_source = await t.getSourceFromUrl(url);
    let source = await t.validateSource(unvalidated_source);
    let ytplayer_config = await t.getYtPlayerConfigFromSource(
      unvalidated_source,
      t.regexp.ytplayer_config
    );
    let fmts = await t.getFmtsFromYtplayerConfig(ytplayer_config);
    let ranked_fmts = await t.getRankedFmts(fmts);
    let working_fmt = await t.getWorkingFmt(ranked_fmts, ytplayer_config);

    console.log(working_fmt);

    t.emit('succes', { result: 'result' });
  }
  catch (err) {
    t.emit('error', err);
  }
};
