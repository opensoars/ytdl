module.exports = function getYtPlayerConfigFromSource(source, regexp_ytplayer_config) {
  console.log('keke');
  return new Promise(function (resolve, reject) {
    if (!is.string(source)) return reject('!is.string(source)');else if (!is.regexp(regexp_ytplayer_config)) return reject('!is.regexp(regexp_ytplayer_config)');

    let ytplayer_config_matches = regexp_ytplayer_config.exec(source);

    if (is.array(ytplayer_config_matches) && ytplayer_config_matches[1]) resolve(JSON.parse(ytplayer_config_matches[1]));else reject('!ytplayer_config_matches');
  });
};