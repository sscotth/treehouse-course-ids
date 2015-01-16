'use strict';

var Nightmare = require('nightmare');
var camelCase = require('camel-case');
var _ = require('lodash');

var output = {};

var app = new Nightmare()
  .goto('http://teamtreehouse.com/tracks')
  .evaluate(getTrackInfo, function(tracks){
    _.each(tracks, function(track){
      setTrackInfo(track);
    });
  })
  .use(function(){
    _.each(output, function(track, key){
      var url = 'http://teamtreehouse.com' + track.url;

      app
        .use(function(){
          console.log('Loading Url:', url);
        })
        .goto(url)
        .evaluate(getTrackDetails, function(data){
          output[key] = _.merge(output[key], data);
        });
    });
  });

app.run(function (err, nightmare) {
  if (err) return console.log(err);

  var camelizedOutput = allKeysToCamelCase(output);
  console.log(JSON.stringify(camelizedOutput));
});

function getTrackDetails(){
  var details = { sections: {} };

  details.title = $('.hero-track h1').text().trim();

  $('.course-preview-modal').each(function(i, item){
    var $item = $(item);
    var hyphenated = $item.attr('id');

    details.sections[hyphenated] = {};
    details.sections[hyphenated].stageCount = +$item.find('h3').text().trim().split(' ')[0];
    details.sections[hyphenated].title = $item.find('h2').text().trim();
    details.sections[hyphenated].url = $item.find('.button-secondary').attr('href');
  });

  return details;
}

function getTrackInfo(){
  return $('.track').map(function(i, track){
    var info = {};
    var $track = $(track);
    var classList = $track.attr('class').split(' ');

    info.url = $track.find('a.title').attr('href');
    info.area = _.difference(classList, ['track', 'card'])[0];
    info.name = $track.find('a.title h3').text();

    return info;
  }).toArray();
}

function setTrackInfo(trackInfo){
  var key = trackUrlToKey(trackInfo.url);

  output[key] = trackInfo;

  return trackInfo;
}

function trackUrlToKey(url){
  return url.split('/').pop();
}

function allKeysToCamelCase(obj){
  var output = {};

  // Recursively changes object keys to use camelCase
  // similar to the solution at: http://stackoverflow.com/a/10196772
  for (var i in obj) {
    if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
      output[camelCase(i)] = allKeysToCamelCase(obj[i]);
    } else {
      output[camelCase(i)] = obj[i];
    }
  }

  return output;
}
