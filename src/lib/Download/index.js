"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');
const fs = require('fs');

const ens = require('ens');
const is = require('is');



let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);
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
  getValidatedSource(source) {
    return new Promise((resolve, reject) => {
      //if (source.indexOf())
      // <script>.+?ytplayer.config.+?=

      resolve(source);
    });
  }
  getPlayerConfigFromSource(source) {
    return new Promise((resolve, reject) => {
      /**
       * Capture the ytplayer object, the pattern used is simple:
       *  <script>.+?ytplayer.config.+?=.+?
       * This matches a script containing a statement which assigns the
       * ytplayer.config property.
       *  (\{.+?\});
       * This matches and captures the object that is assigned to the
       * ytplayer.config property. This works because of the fact that the
       * assignment statement is closed by these two characters };
       *  .+?;<\/script>
       * Allow as much character matches as needed till the closing
       * script tag is found
       */
      let ytplayer_config_matches = 
        /<script>.+?ytplayer.config.+?=.+?(\{.+?\});.+?;<\/script>/
        .exec(source);

      if (is.array(ytplayer_config_matches) && ytplayer_config_matches[1]) {
        let t1 = JSON.parse(ytplayer_config_matches[1]);

        console.log(t1);
      }

    });
  }
  sanitizeVideoInfo(video_info) {
    return new Promise((resolve, reject) => {
      resolve(video_info);
    });
  }
  extractMediaUrlsFromVideoInfo(video_info) {
    return new Promise((resolve, reject) => {
      // Will I be doing the deciphering etc from here?
      // I could use another async function!
      // Which would have its code wrapped in another try catch
      // so we can just use promise resolve and reject api.
    });
  }

  static writeFile(fn, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(__dirname + '/../../../dump/' + fn, content, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

Download.prototype.start = async function start() {
  try {
    let a = await this.getValidatedArguments(this.a);
    let unvalidated_url = await this.getUrlFromArguments(a);
    let url = await this.getValidatedUrl(unvalidated_url);
    let unvalidated_source = await this.getSourceFromUrl(url);
    let source = await this.getValidatedSource(unvalidated_source);
    await Download.writeFile('source', source);
    let unsanitized_player_config = await this.getPlayerConfigFromSource(unvalidated_source);

    console.log(unsanitized_player_config);

    //let unsanitized_player_config = await this.getPlayerConfigFromSource(source);
    //let video_info = await this.sanitizeVideoInfo();
    //let media_urls = await this.extractMediaUrlsFromVideoInfo(video_info);



    this.emit('succes', { result: 'object' });
  }
  catch (err) {
    this.emit('error', err);
  }
};

// Inherit node event emitter
util.inherits(Download, EventEmitter);


module.exports = Download;