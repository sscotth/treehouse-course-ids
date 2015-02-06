/* jshint node: true, devel: true */

'use strict';

var Nightmare    = require('nightmare'),
    _            = require('lodash'),
    request      = require('request'),
    FIREBASE_URL = 'https://yspuku7qvh9u4cr3.firebaseio.com/c8-students',

    app = new Nightmare();

request.get(FIREBASE_URL + '.json', function (err, res, body) {
  _.forEach(JSON.parse(body), function (user, userId) {
    var githubUsername = user.github.username || user.github,
        url            = 'https://github.com/' + githubUsername,
        history;

    app
      .goto(url)
      .use(function () {
        console.log('Loading Url:', url);
      })
      .evaluate(getUserNamesCommitHistory, function (data) {
        history = data;
      })
      .use(function () {
        console.log('Posting Data To Firebase');

        request.put(FIREBASE_URL + '/' + userId + '/' + 'github' + '.json',
          {
            json: {
              username: githubUsername,
              history: history
            }
          }
        );
      });
  });
});


app.run(function (err, nightmare) {
  if (err) { return console.log(err); }
});

function getUserNamesCommitHistory() {
  /* jshint jquery: true */
  return $('[data-count]').map(function (i, dayNode) {
    return $(dayNode).data('count');
  }).toArray();
}
