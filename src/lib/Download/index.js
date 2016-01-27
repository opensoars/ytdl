"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const fs = require('fs');
const url_lib = require('url');
const querystring = require('querystring');

const ens = require('ens');
const is = require('is');



let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);

    this.public = {};
  }
  writeFile(fn, content, silent) {
    if (!silent) console.log('writeFile', fn);
    return new Promise((resolve, reject) => {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  getValidatedArguments(a) {
    return new Promise((resolve, reject) => {
      if (!a)
        reject('!a');
      else if (!a.v && !a.url)  
        reject('!a.v && !a.url');
      else if (!is.string(a.v) && !is.string(a.url))
        reject('!is.string(a.v) && !is.string(a.url)');
      else
        resolve(a);
    });
  }
  getUrlFromArguments(a) {
    return new Promise((resolve, reject) => {
      if (is.string(a.url))
        resolve(a.url);
      else if (is.string(a.v))
        resolve('https://www.youtube.com/watch?v=' + a.v);
      else
        reject('!a.url && !a.v');
    });
  }
  getValidatedUrl(url) {
    return new Promise((resolve, reject) => {
      let is_valid_url = false;

      let re_t1 = /https\:\/\/www\.youtube\.com\/watch\?v\=.+?/;

      if (re_t1.test(url))
        is_valid_url = true;

      is_valid_url ? resolve(url) : reject('Invalid url' + url);
    });
  }
  getSourceFromUrl(url) {
    return new Promise((resolve, reject) => {
      //setTimeout(() => resolve('src code'), 250);
      https.get(url, res => {
        let src = '';
        res.on('data', chunk => src += chunk);
        res.on('end', () => resolve(src));
        res.on('error', err => reject(err));
      });
    });
  }
  // @TODO
  getValidatedSource(source) {
    return new Promise((resolve, reject) => {
      resolve(source);
    });
  }
  getYtPlayerConfigFromSource(source, regexp_ytplayer_config) {
    return new Promise((resolve, reject) => {
      if (!is.string(source)) 
        return reject('!is.string(source)');
      else if (!is.regexp(regexp_ytplayer_config)) 
        return reject('!is.regexp(regexp_ytplayer_config)');
      
      let ytplayer_config_matches = regexp_ytplayer_config.exec(source);

      if (is.array(ytplayer_config_matches) && ytplayer_config_matches[1])
        resolve(JSON.parse(ytplayer_config_matches[1]));
      else
        reject('!ytplayer_config_matches');
    });
  }
  getFmtsFromYtplayerConfig(ytplayer_config) {
    ytplayer_config = ens.obj(ytplayer_config);
    return new Promise((resolve, reject) => {
      if (!ytplayer_config.args)
        return reject('!ytplayer_config.args');
      else if (!is.string(ytplayer_config.args.adaptive_fmts))
        return reject('!is.string(ytplayer_config.args.adaptive_fmts)');

      let fmts = [];
      let adaptive_fmts_string = ytplayer_config.args.adaptive_fmts;
      let split_adaptive_fmt_strings = adaptive_fmts_string.split(',');

      split_adaptive_fmt_strings.forEach(adaptive_fmt_string => {
        fmts.push(querystring.decode(adaptive_fmt_string));
      });

      resolve(fmts);
    });
  }
  getRankedFmts(fmts) {
    fmts = ens.arr(fmts);
    return new Promise((resolve, reject) => {
      fmts.sort((a, b) => {
        let a_i = a.type.indexOf('audio');
        let b_i = b.type.indexOf('audio');
        if (a_i < b_i) return 1;
        if (a_i >= b_i) return -1;
        return 0;
      });
      fmts.sort((a, b) => {
        let a_i = a.type.indexOf('audio/mp4');
        let b_i = b.type.indexOf('audio/mp4');
        if (a_i < b_i) return 1;
        if (a_i >= b_i) return -1;
        return 0;
      // @TODO sort for best bitrate?
      resolve(fmts);
    });
  }
  attemptDownloadsFromRankedFmts(ranked_fmts) {

  }
};

Download.prototype.start = async function start() {
  try {
    let a = await this.getValidatedArguments(this.a);
    let unvalidated_url = await this.getUrlFromArguments(a);
    let url = await this.getValidatedUrl(unvalidated_url);
    let unvalidated_source = await this.getSourceFromUrl(url);
    let source = await this.getValidatedSource(unvalidated_source);
    let ytplayer_config = await this.getYtPlayerConfigFromSource(
      unvalidated_source,
      this.regexp.ytplayer_config
    );
    let fmts = await this.getFmtsFromYtplayerConfig(ytplayer_config);
    let ranked_fmts = await this.getRankedFmts(fmts);
    let temp_loc = await this.attemptDownloadsFromFmts(ranked_fmts);

    console.log(temp_loc);

    // Todo
    // loop ranked_fmts till we find one with a working

/*    let current_fmt = ranked_fmts[0];

    https.get(current_fmt.url, res => {
      console.log(res.statusCode);
    });*/


/*    fmts.forEach((fmt_object, i) => {
      fmts[i].url += '&ratebypass=true';
    });
*/
    //this.writeFile('fmts', fmts.split(',').join('\n\n'));

/*    fmts.split(',').forEach(adaptive_fmt => {
      if (adaptive_fmt.indexOf('type=audio') !== -1)
        fmts.push(querystring.decode(adaptive_fmt));
    });

    fmts.forEach(audio_fmt_object => {
      if (!audio_fmt.s) {
        console.log(audio_fmt);
      }
    });*/

    this.emit('succes', { result: 'result' });
  }
  catch (err) {
    this.emit('error', err);
  }
};

Download.prototype.regexp = {
  /**
   * Captures the ytplayer object, the pattern used is simple:
   *  <script>.+?ytplayer.config.+?=.+?
   * This matches a script containing a statement which assigns the
   * ytplayer.config property.
   *  (\{.+?\});
   * This matches and captures the object that is getting assigned to the
   * ytplayer its config property. This works because of the fact that the
   * assignment statement is closed by these two characters };
   *  .+?;<\/script>
   * Allow as much character matches as needed till the closing
   * script tag is found
   */
  ytplayer_config: /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/
};

// Inherit node event emitter
util.inherits(Download, EventEmitter);


module.exports = Download;