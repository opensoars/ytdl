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
    let video_info = await t.getVideoInfoFromYtplayerConfig(ytplayer_config);
    let file_safe_video_title = await t.makeStringFileSafe(video_info.title);
    let fmts = await t.getFmtsFromYtplayerConfig(ytplayer_config);
    let ranked_fmts = await t.getRankedFmts(fmts);
    let working_url = await t.getWorkingUrl({
      ranked_fmts,
      ytplayer_config
    });
    let temp_file_loc = await t.streamFileToTempDir({
      working_url,
      temp_dir: this.temp_dir,
      file_name: file_safe_video_title
    });

    let file_location = await t.convertFile({
      temp_file_loc,
      temp_dir: this.temp_dir,
      file_name: file_safe_video_title
    });

    this.emit('success', { file_location });
  }
  catch (err) {
    t.emit('error', err);
  }
};
