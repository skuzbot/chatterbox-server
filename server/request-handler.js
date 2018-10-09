const url = require('url');
const fs = require('fs');
const path = require('path');
//const file = require('../client/index.html');

const fileTypes = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.css': 'text/css'
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

const messages = {
  results: [
    {
      username: 'testGuy',
      text: 'testMessage',
      roomname: 'lobby',
      objectId: 1
    }
  ],
};

var requestHandler = function(request, response) {
  console.log('request.methods is:', request.method, 'on url: ', request.url);



  var headers = defaultCorsHeaders;
  if (request.url === '/') {
    console.log('test');
    fs.readFile('../client/index.html', 'utf8', function(err, file) {
      if (err) {
        console.log('got err');
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        response.end('File not found');
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        //response.write(file, 'binary');
        response.end(file);
      }
    });
  } else if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      var statusCode = 200;
      
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));
      
    } else if (request.method === 'POST') {
      
      var rawData = '';
    
      request.on('data', (chuck) => {
        rawData += chuck;
      });

      request.on('end', (data) => {
        data = JSON.parse(rawData);
        let newMessage = {
          'username': data.username,
          'text': data.text,
          'roomname': data.roomname,
          'objectId': messages.results.length + 1,
        };

        messages.results.push(newMessage);
        response.end();
      });

    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, 'httpd/unix-directory');
      response.end();
    }
  } else {
    response.writeHead(404, headers);
    response.end('404 error! not found');
  }

};


module.exports = { requestHandler };
