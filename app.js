var Nightmare = require('nightmare');
var camelCase = require('camel-case');
var output = {};

new Nightmare()
  .goto('http://teamtreehouse.com/tracks')
  .evaluate(getTrackUrls, function(data){
    setTrackUrls(data);
  })
  .run(function (err, nightmare) {
    if (err) return console.log(err);
    console.log('Done!', output);
  });

function getTrackUrls(){
  return $('.track a.title').map(function(i, a){
    return $(a).attr('href');
  }).toArray();
}

function setTrackUrls(data){
  return data
    .map(function(url){
      var key = trackUrlToKey(url);

      output[key] = output[key] || {};
      output[key].url = url;

      return url;
    });
}

function trackUrlToKey(url){
  var hypenatedKey = url.split('/').pop();
  return camelCase(hypenatedKey);
}
