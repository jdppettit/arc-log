var moment = require('moment');
var colors = require('colors');
var path = require('path');
var Promise = require('bluebird').Promise;
var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));

var configuration = {
  max_log_level: 4,
  log_to_file: true,
  path: "/home/virtkick/log/agent.log",
  log_to_console: true,
  timestamp_format: "M/D/YYYY HH:mm:ss:SSS"
};

var level_colors = {
  "UNDEFINED": colors.white,
  "ERROR": colors.red,
  "FATAL": colors.magenta,
  "WARN": colors.yellow,
  "INFO": colors.cyan,
  "DEBUG": colors.blue,
  "SUCCESS": colors.green
};

var level_map = {
  "UNDEFINED": 0,
  "ERROR": 1,
  "FATAL": 2,
  "WARN": 3,
  "INFO": 4,
  "DEBUG": 5,
  "SUCCESS": 6
};

function logToFile(line) {
  if (configuration.hasOwnProperty("path")) {
    mkdirp(configuration.path).then(function() {
      fs.appendFile(configuration.path, line + "\n", function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  } else {
    console.log("No path for log file specified in configuration...");
  }
}

function getTimestamp() {
  return moment().format(configuration.timestamp_format);
}

module.exports = {
  log: function(message, level) {
    if (typeof(level) !== "undefined") {
      level = level.toUpperCase();
      if (level == "WARNING") {
        level = "WARN";
      }
    } else {
      level = "undefined";
    }

    var f = level_colors[level] || function(v) {
      return v;
    }
    var line;

    if (configuration.max_log_level >= level_map[level]) {
      line = f("[" + getTimestamp() + "] [" + level + "] " + message);
    }

    if (configuration.log_to_file && line != null) {
      logToFile(line);
    }

    if (configuration.log_to_console && line != null) {
      console.log(line);
    }
  },

  set: function(key, value) {
    configuration[key] = value;
  }

};
