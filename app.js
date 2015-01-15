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
    _.each(output, function(track){
      var url = 'http://teamtreehouse.com' + track.url;
      app
        .use(function(){
          console.log('Goto:', url);
        })
        .goto(url)
        .screenshot(track.name + '.png');
    });
  });

app.run(function (err, nightmare) {
  if (err) return console.log(err);
  console.log('Done!', output);
});

function getTrackInfo(){
  return $('.track').map(function(i, track){
    var info = {};
    $track = $(track);
    info.url = $track.find('a.title').attr('href');

    var classList = $track.attr('class').split(' ');
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
  var hypenatedKey = url.split('/').pop();
  return camelCase(hypenatedKey);
}
