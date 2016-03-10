# ytdl

Async YouTube downloader. Utilizing ES6 and ES7 features.

[![Build Status](https://travis-ci.org/opensoars/ytdl.svg?branch=master)](https://travis-ci.org/opensoars/ytdl)

<!---
[![Coverage Status](https://coveralls.io/repos/opensoars/ytdl/badge.svg?branch=master&service=github)](https://coveralls.io/github/opensoars/ytdl?branch=master)
[![Inline docs](http://inch-ci.org/github/opensoars/ytdl.svg?branch=master)](http://inch-ci.org/github/opensoars/ytdl)
[![Codacy Badge](https://api.codacy.com/project/badge/f3e64501763645b9aa483bf83a4dd1d5)](https://www.codacy.com/app/sam_1700/ytdl)
[![Code Climate](https://codeclimate.com/github/opensoars/ytdl/badges/gpa.svg)](https://codeclimate.com/github/opensoars/ytdl)
[![Dependency Status](https://david-dm.org/opensoars/ytdl.svg)](https://david-dm.org/opensoars/ytdl)
[![devDependency Status](https://david-dm.org/opensoars/ytdl/dev-status.svg)](https://david-dm.org/opensoars/ytdl#info=devDependencies)
-->

---

# Use

```
const ytdl = require('ytdl');

const log = console.log;

const dl = new ytdl.Download({v: 'NnTg4vzli5s'})
  .on('error', err => log('error', err))
  .on('succes', result => log('succes', result))
  .on('callMethod', method => log(`callMethod: ${method}`))
  .on('stream-progress', progress => log('stream-progress', progress))
  .on('conversion-progress', progress => log('conversion-progress', progress))
  .start();
```