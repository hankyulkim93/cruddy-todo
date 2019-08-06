const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir + '/' + id + '.txt'), text, (err) => {
      if (err) {
        throw 'error';
      } else {
        callback(null, { id, text });
      }
    });
  });
  // var id = counter.getNextUniqueId();
  // console.log(id);
  // // counter.getNextUniqueId((err, id) => {
  // var idTxt = `/${id}.txt`;
  // fs.writeFile(path.join(exports.dataDir, idTxt), text, (err) => {
  //   if (err) {
  //     throw ('error');
  //   }
  // });
  // // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    files = files.map((file) => {
      return {
        id: file.slice(0, 5),
        text: file.slice(0, 5)
      };
    });
    callback(null, files);
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    console.log(files);
    console.log(id);
    // console.log(files[0].slice(0,5));
    if (err) {
      console.log(err);
      return;
    } else {
      if (files.includes(id + '.txt') === false) {
        console.log('file not found');
        return;
      } else {
        for (var i = 0; i < files.length; i++) {
          if (files[i].slice(0, 5) === id) {
            return {
              id: files[i].slice(0, 5),
              text: files[i].slice(0, 5)
            };
          }
        }
      }
    }
    callback(null, files);
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
