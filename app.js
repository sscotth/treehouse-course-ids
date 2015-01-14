var Nightmare = require('nightmare');

new Nightmare()
  .goto('http://teamtreehouse.com')
  .screenshot('screen.png')
  .run(function (err, nightmare) {
    if (err) return console.log(err);
    console.log('Done!');
  });
