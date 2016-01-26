"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

let p1 = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(123);
    }, 1000);
  });
};

let test = function () {
  var ref = _asyncToGenerator(function* () {
    let r1 = yield p1();
    console.log(r1);
  });

  return function test() {
    return ref.apply(this, arguments);
  };
}();

test();