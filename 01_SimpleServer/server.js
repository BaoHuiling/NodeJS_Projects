// require modules
var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
	
// Array of Mime Types
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

const hostname = '10.166.31.102';
const port = 3001;

// Create Server
const server = http.createServer(function(req, res) {
  // When u receive a request
  var uri = url.parse(req.url).pathname; 
  var filename = path.join(process.cwd(), unescape(uri));
  var stats;
  
  try {
    stats = fs.lstatSync(filename);   // see if it's valid
  } 
  catch (e) {// throws if path doesn't exist
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }

  // if it's valid and has a correspond item to return
  if (stats.isFile()) {
    // path exists, is a file
    var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
    res.writeHead(200, {'Content-Type': mimeType} );

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    // path exists, is a directory
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Index of '+uri+'\n');
    res.end();
	return;
  } else {

    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal server error\n');
    res.end();
	return;
  }

});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


