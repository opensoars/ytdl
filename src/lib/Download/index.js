"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const https = require('https');

const ens = require('ens');

let Download = class Download {
  constructor(a) {
    this.a = ens.obj(a);
  }
  validateArguments(a) {
    return new Promise((resolve, reject) => {
      if (!a)
        reject('!a');
      else if (!a.v && !a.url)  
        reject('!a.v && !a.url');
      else if (typeof a.v !== 'string' && typeof a.url !== 'string')
        reject("typeof a.v !== 'string' && typeof a.url !== 'string'");
      else
        resolve(a);
    });
  }
  getUrlFromArguments(a) {
    return new Promise((resolve, reject) => {
      if (a.url && typeof a.url === 'string')
        resolve(a.url);
      else if (a.v && typeof a.v === 'string')
        resolve('https://www.youtube.com/watch?v=' + a.v);
      else
        reject('!a.url && !a.v');
    });
  }
  validateUrl(url) {
    return new Promise((resolve, reject) => {
      let is_valid_url = false;

      let re_t1 = /https\:\/\/www\.youtube\.com\/watch\?v\=.+?/;

      if (re_t1.test(url))
        is_valid_url = true;

      is_valid_url ? resolve(url) : reject('Invalid url' + url);
    });
  }
  getSource(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('src code');
      }, 250);
/*      https.get(url, res => {
        let src = '';
        res.on('data', chunk => src += chunk);
        res.on('end', () => resolve(src));
        res.on('error', err => reject(err));
      });*/
    });
  }
  getVideoInfoFromSource(source) {
    return new Promise((resolve, reject) => {

    });
  }
  sanitizeVideoInfo(video_info) {
    return new Promise((resolve, reject) => {

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
}

Download.prototype.start = async function start() {
  try {
    let a = await this.validateArguments(this.a);
    let unvalidated_url = await this.getUrlFromArguments(a);
    let url = await this.validateUrl(unvalidated_url);
    let source = await this.getSource(url);
    let unsanitized_video_info = await this.getVideoInfoFromSource(source);
    let video_info = await this.sanitizeVideoInfo();
    let media_urls = await this.extractMediaUrlsFromVideoInfo(video_info);

    this.emit('succes', { result: 'object' });
  }
  catch (err) {
    this.emit('error', err);
  }
};

// Inherit node event emitter
util.inherits(Download, EventEmitter);


module.exports = Download;