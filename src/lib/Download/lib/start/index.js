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
    let working_url = await t.getWorkingUrl({
      ranked_fmts,
      ytplayer_config,
      WorkingUrlFinder: t.WorkingUrlFinder,
      //decipher_function_name_re: t.regexp.decipher_function_name
    });
    console.log(working_url);


/*    if (working_fmt) {
      t.emit('succes', { result: 'result' });
    }
    else {
      t.emit('error', 'if (working_fmt) not passed');
    }*/

   // console.log(working_fmt);

    
  }
  catch (err) {
    t.emit('error', err);
  }
};
